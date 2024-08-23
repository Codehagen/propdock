/**
 * `superfetch` abstracts auth, request formatting and error handling for certain known services, enabling much simpler, cleaner syntax.
 * Use the methods `.get()`, `.post()`, etc.
 * 
 * Only allows relative URLs. The base URL has to be supplied without a trailing slash, and the relative URL has to be supplied with a prefixed slash.
 * 
 * With this approach it becomes considerably harder for a developer to mistakenly mix in another workspace's credentials or data;
 * Since auth isn't supplied per-request, the developer is guaranteed that the auth will always be fetched for the given workspace.
 * Dynamic URLs ensures that a bad copypasta or typo doesn't send potentially confidential data to an unintended site.
 * 
 * @example 
 * const sf = IntegrationSuperfetch("https://api.fiken.no", Fiken.getRequestHeaders(c.env, user.workspaceId))
 * const res = sf.get('/users')
 */
class IntegrationSuperfetch {
    private getHeaders: () => Promise<Record<string, string>>
    private baseUrl: string

    constructor(url: string, getHeaders: () => Promise<Record<string, string>>) {
        this.getHeaders = getHeaders;
        this.baseUrl = url
    }

    /**
     * The raw `fetch` mechanism. It's provided as a public interface, though it should be unnecessary.
     * For direct usage, see `post`, `get`, etc. instead.
     * 
     * @param verb - HTTP method
     * @param url - Endpoint where the request gets delivered
     * @param body - Request body, can be `null` or not passed. See `bodyFormat` also.
     * @param bodyFormat - The format of the request body. Can be one `json`, `form` or `text`.
     * 
     * @returns A promise that resolves to the raw request from the server
     * 
     * @throws If the `response` is not marked as `ok`.
     */
    async fetch({
        verb,
        url,
        body = null,
        bodyFormat = 'json'
    }: {
        verb: string,
        url: string,
        body?: any,
        bodyFormat?: string
    }) {
        // Determine ContentType based on `bodyFormat`
        const contentType = bodyFormat === 'json'
        ? 'application/json'
        : bodyFormat === 'form'
        ? 'application/x-www-form-urlencoded'
        : 'text/plain';

        let requestBody: string | undefined;
        if (bodyFormat === 'json') {
            requestBody = body ? JSON.stringify(body) : undefined;
        } else if (bodyFormat === 'form') {
            requestBody = body
                ? new URLSearchParams(body as Record<string, string>).toString()
                : undefined;
        } else if (bodyFormat === 'text') {
            requestBody = body ? String(body) : undefined;
        }

        // Generate fresh headers
        const headers = await this.getHeaders()

        // Compile a RequestInit object
        const requestOptions: RequestInit = {
            method: verb,
            headers: {
                ...headers,
                'Content-Type': contentType,
            },
            ...(verb === 'POST' || verb === 'PUT' || verb === 'PATCH') && requestBody != null
                ? { body: requestBody }
                : {}
        };

        // Let it fly!
        let response
        try {
            response = await fetch(url, requestOptions)

            if (!response.ok) {
                throw new Error(`Bad response: (HTTP ${response.status}) ${response.statusText}`)
            }
        } catch (error: any) {
            console.error(`superfetch error: ${error.message}`)
            console.error("Additional error info:", await response?.text())
            console.debug(`URL: ${url}`)
            console.debug("Request options:", requestOptions)
            throw error
        }

        return response
    }

    /**
     * `HTTP GET`-wrapper
     * 
     * @param url - Request endpoint
     * @returns Response object
     * @throws Propagates all underlying errors
     */
    async get(url: string) {
        const payload = {
            'verb': "GET",
            'url': `${this.baseUrl}${url}`,
        }

        let response
        try {
            response = await this.fetch(payload)
            return response
        } catch (error: any) {
            console.error(`superfetch.get(): (${response?.status}) ${error} => ${error.message}`)
            console.debug("Payload:", payload)
            throw error
        }
    }

    /**
     * Performs a `GET` request and returns the body as JSON.
     * Returns `null` if the body can't be parsed as JSON.
     * 
     * @throws Nothing, ever.
     */
    async getAsJSON(url: string): Promise<Record<string, string> | null> {
        let res
        try {
            res = await this.get(url)
            const json = await res.json() 

            if (json === null || typeof json !== 'object') {
                throw new Error("JSON was null")
            } else {
                return json as Record<string, string>
            }
        } catch (error: any) {
            console.error(`superfetch.getAsJSON(): (${res?.status}) ${error}`)
            return null
        }
    }

    async post(url: string, body: any, bodyFormat: string = "json") {
        const payload = {
            'verb': "POST",
            'url': `${this.baseUrl}${url}`,
            'body': body,
            'bodyFormat': bodyFormat,
        }

        let response
        try {
            response = await this.fetch(payload)
            return response
        } catch (error: any) {
            console.error(`superfetch.get(): (${response?.status}) ${error} => ${error.message}`)
            console.debug("Payload:", payload)
            throw error
        }
    }
}

export default IntegrationSuperfetch