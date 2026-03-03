import cookie from '@fastify/cookie';
import jwt from '@fastify/jwt';
import fp from 'fastify-plugin';
import { authenticate, optionalAuth } from '../services/auth.service.js';

function resolveJwtSecret() {
    const value = process.env.JWT_SECRET;
    if (!value || value.trim() === '') {
        throw new Error('Missing required environment variable: JWT_SECRET');
    }
    return value;
}

function resolveCookieSecret() {
    const value = process.env.COOKIE_SECRET;
    if (!value || value.trim() === '') {
        throw new Error('Missing required environment variable: COOKIE_SECRET');
    }
    return value;
}

const jwtSecret = resolveJwtSecret();
const cookieSecret = resolveCookieSecret();


/**
 * Authentication plugin for User Service
 * Sets up cookie and JWT for token signing, and authenticate decorator
 */
async function authPlugin(app) {
    // Register cookie plugin
    app.register(cookie, {
        secret: cookieSecret,
        cookie: {
            cookieName: 'access_token',
            signed: false
        }
    });

    // Register JWT plugin for signing tokens (used in login/register)
    app.register(jwt, {
        secret: jwtSecret,
        cookie: {
            cookieName: 'access_token',
            signed: false
        }
    });

    // Decorate app with authenticate middleware
    // This reads user info from headers set by API Gateway
    app.decorate("authenticate", authenticate);

    app.decorate("optionalAuth", optionalAuth);
}

export default fp(authPlugin);
