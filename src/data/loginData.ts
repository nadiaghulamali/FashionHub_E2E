/**
 * Centralized data for the Login/Authentication Use Case.
 * This file consolidates credentials and locators used by both the 
 * authentication fixture (for state creation) and the test cases (for verification).
 */

// --- CREDENTIALS ---
export const VALID_USER = 'demouser';
export const VALID_PASS = 'fashion123';
export const WRONG_USER = 'wronguser';
export const WRONG_PASS = 'wrongpass';

// --- LOCATORS & MESSAGES ---
export const LOGIN_LOCATORS = {

    USERNAME_INPUT: '#username',
    PASSWORD_INPUT: '#password',

    LOGIN_BUTTON: 'input[type="submit"]',
    
    LOGOUT_BUTTON: 'text=Logout', 

    // Locator for the error message container
    AUTH_ERROR_MESSAGE: '#errorMessage', 
};

// Text expected from the application for errors (for future API deployment)
export const EXPECTED_AUTH_ERROR_TEXT = 'Invalid username or password.';