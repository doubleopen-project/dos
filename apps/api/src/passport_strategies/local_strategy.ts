// SPDX-FileCopyrightText: 2023 HH Partners
//
// SPDX-License-Identifier: MIT

import passportLocal from 'passport-local';
import * as dbQueries from '../helpers/db_queries';
import crypto from 'crypto';

const LocalStrategy = passportLocal.Strategy;

export const localStrategy = new LocalStrategy(async function verify(username, password, done) {
    try {
        const user = await dbQueries.findUserByUsername(username);
        if (!user) {
            return done(null, false, { message: 'Incorrect username or password' });
        }

        crypto.pbkdf2(password, user.salt, 310000, 32, 'sha256', (err, derivedKey) => {
            if (err) {
                console.log('Error: ', err);
                return done(err);
            }
            if (!crypto.timingSafeEqual(derivedKey, user.hashedPassword)) {
                return done(null, false, { message: 'Incorrect username or password' });
            }
            console.log('User authenticated');

            return done(null, user);
        });
    } catch (error) {
        console.log('Error: ', error);
        return done(error);
    }

})