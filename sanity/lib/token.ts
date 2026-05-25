export const token = assertValue(
    process.env.SANITY_API_TOKEN,
    'Missing environment variable NEXT_PUBLIC_SANITY_API_TOKEN'
)

function assertValue<T>(v: T | undefined, errorMessage: string): T {
    if (v === undefined) {
        throw new Error(errorMessage)
    }
    return v
}