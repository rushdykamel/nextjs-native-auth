## About
This is a native Next.js authentication starter app that does not require any external authentication libraries. The application leverages cookies for session management and uses PostgreSQL for storing user information securely.

## Features
- **Login**: Authenticate users by verifying their credentials.
- **Sign up**: Allow new users to create an account with a username, email, and password.
- **Logout**: Securely log out users and terminate their sessions.
- **Edit account details**: Enable users to update their profile information such as name and password.
- **Forgot password/generate password link**: Provide a mechanism for users to reset their passwords by generating a unique link.
  - The reset link is configured to expire in 30 minutes or after a single use.
- **Update password using generated link**: Allow users to securely update their password through the provided reset link.
- **Password encryption**: Ensure user passwords are stored securely using encryption.
- **Session timeout**: Automatically log out users after a period of inactivity to enhance security.

## Stack
- **Next.js**
- **TypeScript**
- **PostgreSQL** for storing user information.
- **Material-UI** for user interfaces and icons.
- **jose** and **bcrypt**: for encryption and decryption of passwords and sessios (using `jwt`) to ensure secure handling of sensitive data.

## Getting started
1. Run `npm install` to install all necessary dependencies.
2. Copy `.env.example` into a new file named `.env.local`.
3. Fill in the missing values in `.env.local`, such as database connection details and session settings.
4. Create a new PostgreSQL database or use an existing one for the application.
5. Run the following SQL script to create the required tables
```sql
CREATE TABLE IF NOT EXISTS public.users
(
    id character varying(50) NOT NULL,
    full_name character varying(255) NOT NULL,
    email character varying(255) NOT NULL,
    password character varying(255) NOT NULL,
    date_created timestamp without time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,  
	CONSTRAINT users_pkey PRIMARY KEY (id),
    CONSTRAINT users_email_key UNIQUE (email)
);


CREATE SEQUENCE IF NOT EXISTS public.password_reset_links_id_seq
    INCREMENT 1
    START 1
    MINVALUE 1
    MAXVALUE 2147483647
    CACHE 1;

CREATE TABLE IF NOT EXISTS public.password_resets
(
    id integer NOT NULL DEFAULT nextval('password_reset_links_id_seq'::regclass),
    user_id character varying(50) COLLATE pg_catalog."default" NOT NULL,
    reset_token character varying(255) COLLATE pg_catalog."default" NOT NULL,
    expires_at timestamp without time zone NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT password_reset_links_pkey PRIMARY KEY (id),
    CONSTRAINT fk_user FOREIGN KEY (user_id)
        REFERENCES public.users (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
);

ALTER SEQUENCE public.password_reset_links_id_seq
    OWNED BY public.password_resets.id;
```
5. Run `npm run dev`
6. Navigate to `http://localhost:3000`


## Notes
- You are free to use the database of your choice. However, you will need to modify the code in the `data/` folder to read from and write to your chosen database.
- The password recovery link will be displayed in the console. Copy and paste it into the browser to access the "update password" page. Modify `lib/auth.js` > `generatePasswordLink()` to use the generated link as you prefer, such as sending it to the user via email.
- For simplicity, the user fields are: name, email, and password. You can add additional fields to suit your needs. Update `types/user.ts` and `data/users.ts` > `mapUser()` to match the new fields.
- In `.env.local`, the `ENCRYPT_SECRET` can be any key of your choice. Be aware that if you change it later, current users will not be able to log in as their passwords have been encrypted with the previous secret.


## Screenshots
##### Home page (not logged in)
![Home page (not logged in)](https://raw.githubusercontent.com/rushdykamel/nextjs-native-auth/main/screenshots/1-not-logged-in.png)

##### Login page
![Login page](https://raw.githubusercontent.com/rushdykamel/nextjs-native-auth/main/screenshots/2-login-page.png)

##### Forget password page
![Forget password page](https://raw.githubusercontent.com/rushdykamel/nextjs-native-auth/main/screenshots/3-forget-password.png)

##### Update password page
![Update password page](https://raw.githubusercontent.com/rushdykamel/nextjs-native-auth/main/screenshots/4-update-password.png)

##### Sign up page
![Sign up](https://raw.githubusercontent.com/rushdykamel/nextjs-native-auth/main/screenshots/5-signup.png)

##### Home page (logged in)
![Home page (logged in)](https://raw.githubusercontent.com/rushdykamel/nextjs-native-auth/main/screenshots/6-logged-in.png)

##### Edit account
![Edit account](https://raw.githubusercontent.com/rushdykamel/nextjs-native-auth/main/screenshots/7-edit-account.png)
