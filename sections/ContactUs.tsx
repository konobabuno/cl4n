'use client'

import TitleText from "@/components/TitleText";
import { useState } from "react";
import { useI18n } from "@/config/i18n/i18nProvider";
import { PortableTextBlock } from "@portabletext/types";
import AnimateOnView from "@/components/AnimateOnView";

type ContactUs = {
  title: PortableTextBlock;
  description: string;
  backgroundColor: { value: string };
};

export default function ContactUs(section: ContactUs) {
  const color = section.backgroundColor?.value || '#B70100';  
  const newColorString = (color || '#B70100').slice(0, 7);

  const [values, setValues] = useState({
    name: "",
    compania: "",
    correo: "",
    subject: "",
    message: "",
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [contactMessage, setContactMessage] = useState("Correo sin enviar");
  const [isVisible, setIsVisible] = useState(false);

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  function validate() {
    let errs: { [key: string]: string } = {};
    if (!values.name.trim()) errs.name = "Este campo es requerido";
    if (!values.correo.trim()) errs.correo = "Este campo es requerido";
    if (!values.subject.trim()) errs.subject = "Este campo es requerido";
    if (values.correo && !emailRegex.test(values.correo)) {
      errs.correo = "Correo inválido";
    }
    return errs;
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const { name, value } = e.target;
    setValues(prev => ({ ...prev, [name]: value }));
    setErrors(prevErrors => {
      if (prevErrors[name]) {
        const updatedErrors = { ...prevErrors };
        delete updatedErrors[name];
        return updatedErrors;
      }
      return { ...prevErrors };
    });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const validationErrors = validate();
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length === 0) {
      // Mostrar toast enviando
      setContactMessage("Enviando mensaje...");
      setIsVisible(true);

      try {
        const res = await fetch("/api/contact", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(values),
        });
        const data = await res.json();

        if (data.success) {
          setContactMessage("Tu mensaje ha sido enviado exitosamente.");
          setValues({ name: "", compania: "", correo: "", subject: "", message: "" });
        } else {
          setContactMessage("Ha ocurrido un error al enviar tu mensaje. Intenta de nuevo.");
        }
      } catch {
        setContactMessage("Ha ocurrido un error al enviar tu mensaje. Por favor, intenta de nuevo más tarde.");
      }

      setTimeout(() => {
        setIsVisible(false);
      }, 3000);
    }
    
  }

  const {dict} = useI18n();

  return (
    <section style={{ backgroundColor: newColorString }} className="mt-0! pt-[116px] md:pt-58! lg:pt-[161px]!">
      <div className="container p-lat  relative">
        <div className="extra-layout-top" style={{ backgroundColor: newColorString }}></div>
        <div className="row justify-center lg:justify-start relative z-8 pb-pink">
          <AnimateOnView className="w-full lg:w-4/12 text-center lg:text-left">
             <h2 className="h1  relative animate">
              <TitleText text={section.title} />
            </h2>
            {section.description && (
              <p className="uppercase pt-red animate ">{section.description}</p>
            )}
            <div className="flex gap-4 pt-blue uppercase ">
              <a href="https://www.instagram.com/cl4n___/" className="flex gap-4 border border-offwhite py-4 px-8 rounded-[5px] lg:rounded-[10px] animate flex-1 lg:flex-0 justify-center" target="_blank" rel="noopener noreferrer">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <g clipPath="url(#clip0_10001_366)">
                  <path d="M1.6665 10C1.6665 6.88502 1.6665 5.32669 2.3365 4.16669C2.77533 3.40665 3.40647 2.77551 4.1665 2.33669C5.3265 1.66669 6.88484 1.66669 9.99984 1.66669C13.1148 1.66669 14.6732 1.66669 15.8332 2.33669C16.5932 2.77551 17.2243 3.40665 17.6632 4.16669C18.3332 5.32669 18.3332 6.88502 18.3332 10C18.3332 13.115 18.3332 14.6734 17.6632 15.8334C17.2243 16.5934 16.5932 17.2245 15.8332 17.6634C14.6732 18.3334 13.1157 18.3334 9.99984 18.3334C6.884 18.3334 5.3265 18.3334 4.1665 17.6634C3.40647 17.2245 2.77533 16.5934 2.3365 15.8334C1.6665 14.6734 1.6665 13.1159 1.6665 10Z" stroke="#FDF9F3" strokeWidth="1.5"/>
                  <path d="M14.7917 5.20837H14.795V5.21171H14.7917V5.20837ZM13.75 10C13.75 10.9946 13.3549 11.9484 12.6517 12.6517C11.9484 13.355 10.9946 13.75 10 13.75C9.00544 13.75 8.05161 13.355 7.34835 12.6517C6.64509 11.9484 6.25 10.9946 6.25 10C6.25 9.00548 6.64509 8.05165 7.34835 7.34839C8.05161 6.64513 9.00544 6.25004 10 6.25004C10.9946 6.25004 11.9484 6.64513 12.6517 7.34839C13.3549 8.05165 13.75 9.00548 13.75 10Z" stroke="#FDF9F3" strokeWidth="1.5" strokeLinejoin="round"/>
                  </g>
                  <defs>
                  <clipPath id="clip0_10001_366">
                  <rect width="20" height="20" fill="white"/>
                  </clipPath>
                  </defs>
                </svg>
                Instagram
              </a>
              <a href="https://vimeo.com/cl4n" className="flex gap-4 border border-offwhite py-4 px-8 rounded-[5px] lg:rounded-[10px] animate flex-1 lg:flex-0 justify-center " target="_blank" rel="noopener noreferrer">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <g clipPath="url(#clip0_10001_375)">
                  <path d="M0.833496 6.24998C5.8335 0.694424 8.61127 0.972202 9.16683 7.08331C9.72238 13.1944 11.1113 13.75 13.3335 8.74998C14.3335 6.4722 13.6391 5.63887 11.2502 6.24998C12.0835 3.4722 13.8891 2.08331 16.6668 2.08331C19.4446 2.08331 20.0002 4.02776 18.3335 7.91665C16.6668 11.8055 14.4446 14.75 11.6668 16.75C8.88905 18.75 7.00016 17.75 6.00016 13.75C5.00016 9.74998 4.27794 7.52776 3.8335 7.08331C3.38905 6.63887 2.66683 6.80554 1.66683 7.58331L0.833496 6.24998Z" stroke="#FDF9F3" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </g>
                  <defs>
                  <clipPath id="clip0_10001_375">
                  <rect width="20" height="20" fill="white"/>
                  </clipPath>
                  </defs>
                </svg>
                Vimeo
              </a>
            </div>
            
          </AnimateOnView>
          <AnimateOnView  className="w-full lg:w-7/12 lg:ml-auto pt-red lg:pt-0!">
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4 animate delay-sm-2">
              <div className="input-container relative">
                <input
                  autoComplete="off"
                  name="name"
                  id="name"
                  type="text"
                  value={values.name}
                  onChange={handleChange}
                  className="h-24 rounded-[15px] border border-offwhite contact-input p-8 uppercase w-full"
                  placeholder={dict.general.contact.name}
                />
                {errors.name && <div className="mt-4 uppercase">{errors.name}</div>}
              </div>
              <div className="input-container">
                <input
                  autoComplete="off"
                  type="text"
                  name="compania"
                  id="compania"
                  value={values.compania}
                  onChange={handleChange}
                  className="h-24 rounded-[15px] border border-offwhite contact-input p-8 uppercase w-full"
                  placeholder={dict.general.contact.company}
                />
              </div>
              <div className="input-container">
                <input
                  autoComplete="off"
                  type="text"
                  name="correo"
                  id="correo"
                  value={values.correo}
                  onChange={handleChange}
                  className="h-24 rounded-[15px] border border-offwhite contact-input p-8 uppercase w-full"
                  placeholder={dict.general.contact.email}
                />
                {errors.correo && <div className="mt-4 uppercase">{errors.correo}</div>}
              </div>
              <div className="input-container">
                <input
                  autoComplete="off"
                  type="text"
                  name="subject"
                  id="subject"
                  value={values.subject}
                  onChange={handleChange}
                  className="h-24 rounded-[15px] border border-offwhite contact-input p-8 uppercase w-full"
                  placeholder={dict.general.contact.subject}
                />
                {errors.subject && <div className="mt-4 uppercase">{errors.subject}</div>}
              </div>
              <div className="text-container md:col-span-2">
                <textarea
                  name="message"
                  id="message"
                  value={values.message}
                  onChange={handleChange}
                  className="h-[268px] rounded-[15px] border border-offwhite contact-input p-8 uppercase w-full"
                  placeholder={dict.general.contact.message}
                ></textarea>
              </div>
              <div className="md:col-span-2 flex justify-center lg:justify-start pt-4 md:pt-8">
                <button
                  type="submit"
                  className={`bg-offwhite py-[8px] px-6 lg:px-8 lg:py-4 flex gap-4 items-center rounded-[5px] lg:rounded-[10px] cursor-pointer btn-hover ${
                    (errors && Object.keys(errors).length > 0) ? 'disabled' : ''} ${(isVisible ? 'disabled' : '')}`}
                  disabled={(errors && Object.keys(errors).length > 0)}
                >
                  <span className="dot" style={{ backgroundColor: newColorString }}></span>
                  <p className="uppercase" style={{ color: newColorString }}>{ dict.general.contact.send }</p>
                </button>
              </div>
            </form>
          </AnimateOnView>
        </div>

        {contactMessage && (
          <div className={`fixed bottom-8 left-4 right-4 md:bottom-12 md:left-12 md:w-6/12 lg:w-4/12 z-100 bg-gray p-8 md:p-12 backdrop-blur-[15px] rounded-[15px] transition-opacity duration-500 ${isVisible ? '' : 'opacity-0'}`}>
            <p className="uppercase text-center md:text-start">{contactMessage}</p>
          </div>
        )}

        <div className="extra-layout" style={{ backgroundColor: newColorString }}></div>
      </div>
    </section>
  );
}
