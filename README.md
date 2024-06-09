## About
This is a native NextJs auth starter app. No auth library required.
The app uses cookies to store the sessions and Postgres to store user information.


## Features
- Login
- Sign up
- Logout
- Edit account details
- Forget password/generate password link
  - Expires in 30 mins, or;
  - Expires after one use
- Update password using generated link
- Password encryption
- Session timeout
## Stack
- NextJS
- Typescript
- Postgres for database
- `material-ui` for interface and icons
- `jose` and `bcrypt` for encryption/decryption

## Getting started
- Run `npm install`
- Copy `.env.example` into a new file `.env.local`
- Fill the missing values in `.env.local` i.e database connection and session details
- Create a new database (or use database already exists)
- Run the following SQL to create required tables
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
- Run `npm run dev`
- Navigate to `http://localhost:3000`


## Notes
- Feel free to use database of your choice, you will just need to modify the code in `data/` folder to read/write data to your DB
- Password recovery link will be shown in console, copy and paste in the browser to see "update password" page. modify `lib/auth.js` > `generatePasswordLink()` to use the generated link the way you like, i.e send to user by email.
- For simplicity, user fields are: name, email and password. You can add more fields that suit your needs. You will need to update `types/user.ts` and `data/users.ts` > `mapUser()` to match the required fields.
- In `.env.local` > `ENCRYPT_SECRET` can be any key of your choice. Be aware that if you change it later, current users won't be able to log in as their passwords have already been encrypted with the old secret.