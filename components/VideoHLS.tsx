/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useRef, useState } from "react";
import Hls from "hls.js";

interface VideoHLSProps {
    videoUrl: string;
}

export default function VideoHLS({ videoUrl }: VideoHLSProps) {
    const videoRef = useRef<HTMLVideoElement>(null);
    const [isMuted, setIsMuted] = useState(true);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [aspectRatio, setAspectRatio] = useState<number | null>(null);
    const [userPaused, setUserPaused] = useState(false);
    const [readyToPlay, setReadyToPlay] = useState(false);

    useEffect(() => {
        setReadyToPlay(false);
        if (videoRef.current && Hls.isSupported()) {
            const hls = new Hls();
            hls.loadSource(videoUrl);
            hls.attachMedia(videoRef.current);

            hls.on(Hls.Events.LEVEL_LOADED, () => {
                if (videoRef.current) {
                    videoRef.current.addEventListener("loadedmetadata", () => {
                        const { videoWidth, videoHeight } = videoRef.current!;
                        setAspectRatio(videoHeight / videoWidth);
                    });
                }
            });
            return () => {
                hls.destroy();
            };
        } else if (videoRef.current) {
            videoRef.current.src = videoUrl;
        }
    }, [videoUrl]);

    useEffect(() => {
        const video = videoRef.current;
        if (!video) return;

        const onLoadedMetadata = () => setReadyToPlay(true);
        const onCanPlay = () => setReadyToPlay(true);

        video.addEventListener("loadedmetadata", onLoadedMetadata);
        video.addEventListener("canplay", onCanPlay);

        return () => {
            video.removeEventListener("loadedmetadata", onLoadedMetadata);
            video.removeEventListener("canplay", onCanPlay);
        };
    }, [videoUrl]);

    const toggleMute = () => {
        if (videoRef.current) {
            videoRef.current.muted = !isMuted;
            setIsMuted(!isMuted);
        }
    };

    const togglePlay = () => {
        if (videoRef.current) {
            if (isPlaying) {
                videoRef.current.pause();
                setUserPaused(true);
            } else {
                videoRef.current.play();
                setUserPaused(false);
            }
            setIsPlaying(!isPlaying);
        }
    };

    useEffect(() => {
        const video = videoRef.current;
        if (!video) return;
        if (typeof IntersectionObserver === "undefined") return;

        const observer = new IntersectionObserver(
            (entries) => {
                const entry = entries[0];
                if (!entry) return;

                if (
                    document.fullscreenElement === video ||
                    (video as any).webkitDisplayingFullscreen
                ) {
                    return;
                }
                const visibleEnough = entry.isIntersecting;

                if (!visibleEnough) {
                    if (!video.paused) video.pause();
                } else if (!userPaused && readyToPlay) {
                    void video.play().catch(() => {
                     
                    });
                }
            },
            { threshold: [0, 0.25] },
        );

        observer.observe(video);
        return () => observer.disconnect();
    }, [readyToPlay, userPaused]);

    const toggleFullscreen = () => {
        const video = videoRef.current;
        if (!video) return;

        const isVideoInFullscreen =
            document.fullscreenElement === video ||
            (video as any).webkitDisplayingFullscreen;

        if (!isVideoInFullscreen) {
            if (video.requestFullscreen) {
                video.requestFullscreen();
            } else if ((video as any).webkitEnterFullscreen) {
                (video as any).webkitEnterFullscreen();
            } else if ((video as any).webkitRequestFullscreen) {
                (video as any).webkitRequestFullscreen();
            } else if ((video as any).msRequestFullscreen) {
                (video as any).msRequestFullscreen();
            }
        } else {
            if (document.exitFullscreen) {
                document.exitFullscreen();
            } else if ((document as any).webkitExitFullscreen) {
                (document as any).webkitExitFullscreen();
            } else if ((document as any).msExitFullscreen) {
                (document as any).msExitFullscreen();
            }
        }
    };

    useEffect(() => {
        const handleFullscreenChange = () => {
            const isCurrentlyFullscreen = !!(
                document.fullscreenElement ||
                (document as any).webkitFullscreenElement ||
                (document as any).msFullscreenElement ||
                (videoRef.current as any)?.webkitDisplayingFullscreen
            );

            setIsFullscreen(isCurrentlyFullscreen);
        };

        const handlePause = () => setIsPlaying(false);
        const handlePlay = () => setIsPlaying(true);

        const handleVolumeChange = () => {
            if (videoRef.current) {
                setIsMuted(videoRef.current.muted);
            }
        };

        const video = videoRef.current;

        if (video) {
            video.addEventListener("pause", handlePause);
            video.addEventListener("play", handlePlay);
            video.addEventListener("volumechange", handleVolumeChange);
            video.addEventListener(
                "webkitbeginfullscreen",
                handleFullscreenChange,
            );
            video.addEventListener(
                "webkitendfullscreen",
                handleFullscreenChange,
            );
        }

        document.addEventListener("fullscreenchange", handleFullscreenChange);
        document.addEventListener(
            "webkitfullscreenchange",
            handleFullscreenChange,
        );
        document.addEventListener("msfullscreenchange", handleFullscreenChange);

        return () => {
            if (video) {
                video.removeEventListener("pause", handlePause);
                video.removeEventListener("play", handlePlay);
                video.removeEventListener("volumechange", handleVolumeChange);
                video.removeEventListener(
                    "webkitbeginfullscreen",
                    handleFullscreenChange,
                );
                video.removeEventListener(
                    "webkitendfullscreen",
                    handleFullscreenChange,
                );
            }

            document.removeEventListener(
                "fullscreenchange",
                handleFullscreenChange,
            );
            document.removeEventListener(
                "webkitfullscreenchange",
                handleFullscreenChange,
            );
            document.removeEventListener(
                "msfullscreenchange",
                handleFullscreenChange,
            );
        };
    }, []);

    return (
        <div
            className="relative overflow-hidden rounded-[15px] "
            style={{
                aspectRatio: aspectRatio ? `${1 / aspectRatio}` : "1.7777",
            }}
        >
            <video
                ref={videoRef}
                loop
                muted
                playsInline
                preload="metadata"
                className="w-full h-auto"
            />
            <div
                className={`absolute bg-gray backdrop-blur-[20px] w-14 h-14 md:w-16 md:h-16 lg:w-20 lg:h-20 bottom-6 left-6 md:left-8 md:bottom-8 rounded-full cursor-pointer flex justify-center items-center video ${isPlaying ? "" : "pause"}`}
                onClick={togglePlay}
            >
                <svg
                    className="pause scale-75 lg:scale-100"
                    width="14"
                    height="17"
                    viewBox="0 0 14 17"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <rect width="4.66667" height="17" rx="1" fill="#FDF9F3" />
                    <rect
                        x="9.33325"
                        width="4.66667"
                        height="17"
                        rx="1"
                        fill="#FDF9F3"
                    />
                </svg>
                <svg
                    className="play scale-75 lg:scale-100"
                    width="13"
                    height="16"
                    viewBox="0 0 13 16"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path
                        d="M12.5 7.13397C13.1667 7.51888 13.1667 8.48112 12.5 8.86602L2 14.9282C1.33333 15.3131 0.499999 14.832 0.499999 14.0622L0.5 1.93782C0.5 1.16802 1.33333 0.686896 2 1.0718L12.5 7.13397Z"
                        fill="#FDF9F3"
                    />
                </svg>
            </div>

            <div className="absolute bottom-6 right-6 md:right-8 md:bottom-8 ">
                <div
                    className="bg-gray backdrop-blur-[20px] w-14 h-14 md:w-16 md:h-16 lg:w-20 lg:h-20  rounded-full flex justify-center items-center cursor-pointer"
                    onClick={toggleMute}
                >
                    {isMuted ? (
                        <svg
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                fillRule="evenodd"
                                clipRule="evenodd"
                                d="M19.6153 11.3524C19.2248 11.743 19.2248 12.3761 19.6153 12.7667L20.9941 14.1455C21.3846 14.536 21.3846 15.1691 20.9941 15.5596C20.6037 15.95 19.9706 15.95 19.5801 15.5596L18.2013 14.1807C17.8107 13.7902 17.1776 13.7902 16.7871 14.1807L15.4082 15.5596C15.0177 15.95 14.3846 15.95 13.9941 15.5596C13.6037 15.1691 13.6037 14.536 13.9941 14.1455L15.373 12.7667C15.7635 12.3761 15.7635 11.743 15.373 11.3524L13.9941 9.97361C13.6037 9.58314 13.6037 8.95005 13.9941 8.55958C14.3846 8.1691 15.0177 8.1691 15.4082 8.55957L16.7871 9.93842C17.1776 10.3289 17.8107 10.3289 18.2013 9.93841L19.5801 8.55958C19.9706 8.1691 20.6037 8.1691 20.9941 8.55956C21.3846 8.95004 21.3846 9.58315 20.9941 9.97363L19.6153 11.3524ZM10.9883 6.05937C10.9883 5.2246 10.0259 4.75728 9.36989 5.2735L6.06412 7.87478C5.88784 8.01349 5.67004 8.08891 5.44573 8.08891H3C2.44772 8.08891 2 8.53662 2 9.08891V15.0889C2 15.6412 2.44772 16.0889 3 16.0889H5.4568C5.67789 16.0889 5.89275 16.1621 6.06777 16.2972L9.37731 18.8514C10.0347 19.3588 10.9883 18.8902 10.9883 18.0598V6.05937Z"
                                fill="#FDF9F3"
                            />
                        </svg>
                    ) : (
                        <svg
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <g clipPath="url(#clip0_8221_209)">
                                <path
                                    fillRule="evenodd"
                                    clipRule="evenodd"
                                    d="M10.9883 6.05937C10.9883 5.2246 10.0259 4.75728 9.36989 5.2735L6.06412 7.87478C5.88784 8.01349 5.67004 8.08891 5.44573 8.08891H3C2.44772 8.08891 2 8.53662 2 9.08891V15.0889C2 15.6412 2.44772 16.0889 3 16.0889H5.4568C5.67789 16.0889 5.89275 16.1621 6.06777 16.2972L9.37731 18.8514C10.0347 19.3588 10.9883 18.8902 10.9883 18.0598V6.05937Z"
                                    fill="#FDF9F3"
                                />
                                <path
                                    d="M16.0004 15.0002L16.0018 8.99816C16.002 8.44584 15.5543 7.99803 15.0019 7.99804C14.4498 7.99805 14.0022 8.44556 14.0021 8.99769L14.0007 14.9997C14.0005 15.552 14.4482 15.9998 15.0005 15.9998C15.5527 15.9998 16.0003 15.5523 16.0004 15.0002Z"
                                    fill="#FDF9F3"
                                />
                                <path
                                    d="M20.0041 16.9998L20.0004 6.99953C20.0002 6.44745 19.5526 6.00001 19.0005 6.00002C18.4481 6.00003 18.0004 6.44792 18.0006 7.00028L18.0044 17.0005C18.0046 17.5526 18.4522 18 19.0043 18C19.5566 18 20.0043 17.5521 20.0041 16.9998Z"
                                    fill="#FDF9F3"
                                />
                            </g>
                            <defs>
                                <clipPath id="clip0_8221_209">
                                    <rect width="24" height="24" fill="white" />
                                </clipPath>
                            </defs>
                        </svg>
                    )}
                </div>
            </div>
            <div className="absolute top-6 right-6 md:right-8 md:top-8">
                <div
                    className="bg-gray backdrop-blur-[20px] w-14 h-14 md:w-16 md:h-16 lg:w-20 lg:h-20  rounded-full flex justify-center items-center cursor-pointer"
                    onClick={toggleFullscreen}
                >
                    {isFullscreen ? (
                        <svg
                            className="sm:scale-[.8] md:scale-[1]"
                            width="22"
                            height="22"
                            viewBox="0 0 22 22"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                d="M4.625 21.5C4.625 21.7761 4.84886 22 5.125 22H7.20833C7.48448 22 7.70833 21.7761 7.70833 21.5V14.7917C7.70833 14.5155 7.48448 14.2917 7.20833 14.2917H0.500001C0.223858 14.2917 0 14.5155 0 14.7917V16.875C0 17.1511 0.223858 17.375 0.5 17.375H4.125C4.40114 17.375 4.625 17.5989 4.625 17.875V21.5ZM14.2917 0.500001C14.2917 0.223858 14.5155 0 14.7917 0H16.875C17.1511 0 17.375 0.223858 17.375 0.5V4.125C17.375 4.40114 17.5989 4.625 17.875 4.625H21.5C21.7761 4.625 22 4.84886 22 5.125V7.20833C22 7.48448 21.7761 7.70833 21.5 7.70833H14.7917C14.5155 7.70833 14.2917 7.48448 14.2917 7.20833V0.500001ZM17.375 17.875C17.375 17.5989 17.5989 17.375 17.875 17.375H21.5C21.7761 17.375 22 17.1511 22 16.875V14.7917C22 14.5155 21.7761 14.2917 21.5 14.2917H14.7917C14.5155 14.2917 14.2917 14.5155 14.2917 14.7917V21.5C14.2917 21.7761 14.5155 22 14.7917 22H16.875C17.1511 22 17.375 21.7761 17.375 21.5V17.875ZM0.500001 7.70833C0.223858 7.70833 0 7.48448 0 7.20833V5.125C0 4.84886 0.223858 4.625 0.5 4.625H4.125C4.40114 4.625 4.625 4.40114 4.625 4.125V0.5C4.625 0.223858 4.84886 0 5.125 0H7.20833C7.48448 0 7.70833 0.223858 7.70833 0.5V7.20833C7.70833 7.48448 7.48448 7.70833 7.20833 7.70833H0.500001Z"
                                fill="#FDF9F3"
                            />
                        </svg>
                    ) : (
                        <svg
                            className="sm:scale-[.8] md:scale-[1]"
                            width="22"
                            height="22"
                            viewBox="0 0 22 22"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                d="M3.08333 14.7917C3.08333 14.5155 2.85948 14.2917 2.58333 14.2917H0.5C0.223857 14.2917 0 14.5155 0 14.7917V21.5C0 21.7761 0.223858 22 0.5 22H7.20833C7.48448 22 7.70833 21.7761 7.70833 21.5V19.4167C7.70833 19.1405 7.48448 18.9167 7.20833 18.9167H3.58333C3.30719 18.9167 3.08333 18.6928 3.08333 18.4167V14.7917ZM0 7.20833C0 7.48448 0.223858 7.70833 0.5 7.70833H2.58333C2.85948 7.70833 3.08333 7.48448 3.08333 7.20833V3.58333C3.08333 3.30719 3.30719 3.08333 3.58333 3.08333H7.20833C7.48448 3.08333 7.70833 2.85948 7.70833 2.58333V0.5C7.70833 0.223857 7.48448 0 7.20833 0H0.500001C0.223858 0 0 0.223858 0 0.5V7.20833ZM18.9167 18.4167C18.9167 18.6928 18.6928 18.9167 18.4167 18.9167H14.7917C14.5155 18.9167 14.2917 19.1405 14.2917 19.4167V21.5C14.2917 21.7761 14.5155 22 14.7917 22H21.5C21.7761 22 22 21.7761 22 21.5V14.7917C22 14.5155 21.7761 14.2917 21.5 14.2917H19.4167C19.1405 14.2917 18.9167 14.5155 18.9167 14.7917V18.4167ZM14.7917 0C14.5155 0 14.2917 0.223858 14.2917 0.5V2.58333C14.2917 2.85948 14.5155 3.08333 14.7917 3.08333H18.4167C18.6928 3.08333 18.9167 3.30719 18.9167 3.58333V7.20833C18.9167 7.48448 19.1405 7.70833 19.4167 7.70833H21.5C21.7761 7.70833 22 7.48448 22 7.20833V0.500001C22 0.223858 21.7761 0 21.5 0H14.7917Z"
                                fill="#FDF9F3"
                            />
                        </svg>
                    )}
                </div>
            </div>
        </div>
    );
}
/* eslint-disable @typescript-eslint/no-explicit-any */
