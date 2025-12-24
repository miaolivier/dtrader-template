import { getOrySessionToken, getWhoAmIURL } from '@deriv/shared';

/**
 * Check session validity via REST API whoami endpoint
 * @returns Promise with response data: { success: true } or { error: { code: 401, status: 'Unauthorized' } }
 */
export const checkWhoAmI = async () => {
    try {
        const isProduction = process.env.NODE_ENV === 'production';
        const whoamiUrl = getWhoAmIURL(isProduction);

        // Extract Ory session token from cookies
        const oryToken = getOrySessionToken();

        const response = await fetch(whoamiUrl, {
            method: 'GET',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
                // Add Authorization header with Ory token from cookie
                ...(oryToken && { Authorization: `Bearer ${oryToken}` }),
            },
        });

        const data = await response.json();

        // Check for 401 Unauthorized error in response body
        if (data.error && (data.error.code === 401 || data.error.status === 'Unauthorized')) {
            return { error: { code: 401, status: 'Unauthorized' } };
        }

        // Return success response
        return { success: true, data };
    } catch (error) {
        // eslint-disable-next-line no-console
        console.error('[WhoAmI Error]', error);
        // Return error but don't trigger cleanup for network errors
        return { error: { message: error.message } };
    }
};
