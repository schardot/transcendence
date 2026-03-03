import fp from 'fastify-plugin';
import jwt from '@fastify/jwt';
import fs from 'fs';
import { authHook } from '../services/auth.service.js';

function resolveJwtSecret() {
    const value = process.env.JWT_SECRET;
    if (!value | value.trim() === '') {
        throw new Error('Missing required environment variable: JWT_SECRET');
    }
    return value;
}

/**
 * Authentication plugin for API Gateway
 * Sets up JWT verification and authentication middleware
 */
async function authPlugin(fastify) {
    const jwtSecret = resolveJwtSecret();

    // Register JWT plugin
    await fastify.register(jwt, {
        secret: jwtSecret,
        cookie: {
            cookieName: 'access_token',
            signed: false
        }
    });

    // Register authentication hook
    fastify.addHook("onRequest", authHook);
}

export default fp(authPlugin);