# AI Chat POC

This is a proof of concept for creating a chat bot for stored character bios that will maintain a "memory" through vector storage of previous chat messages.

## Installation

You'll need an OpenAI API account. You'll also need to set up a Supabase account and create the following tables:

#### User

```sql
create table
  public.user (
    id uuid not null default gen_random_uuid (),
    created_at timestamp with time zone not null default now(),
    last_login timestamp without time zone not null default now(),
    gamertag character varying not null,
    constraint User_pkey primary key (id)
  ) tablespace pg_default;

```

#### Message

```sql
create table
  public.message (
    id uuid not null default gen_random_uuid (),
    received timestamp with time zone null,
    user_id uuid null,
    ai_id bigint null,
    message text null,
    sent_by_user boolean null,
    embedding uuid null,
    constraint message_pkey primary key (id),
    constraint message_ai_id_fkey foreign key (ai_id) references ai_character (id),
    constraint message_embedding_fkey foreign key (embedding) references embeddings (id) on delete set null,
    constraint message_user_id_fkey foreign key (user_id) references "user" (id)
  ) tablespace pg_default;
```

#### AI character

```sql
create table
  public.ai_character (
    id bigint generated always as identity,
    name character varying null,
    bio text null,
    constraint ai_character_pkey primary key (id)
  ) tablespace pg_default;
```

#### Embeddings

```sql
create table
  public.embeddings (
    id uuid not null default gen_random_uuid (),
    vector extensions.vector not null,
    ai_character_id bigint not null,
    message_id uuid not null,
    constraint embeddings_pkey primary key (id),
    constraint embeddings_ai_character_id_fkey foreign key (ai_character_id) references ai_character (id),
    constraint embeddings_message_id_fkey foreign key (message_id) references message (id) on delete cascade
  ) tablespace pg_default;
```

## Run Locally

Clone the project

Add an .env file with the variables listed below.

```bash
  git clone git@github.com:cjohansen11/ai_chat_demo.git
```

Go to the project directory

```bash
  cd ai_chat_demo
```

Install dependencies

```bash
  yarn install
```

Start the server

```bash
    yarn dev
```

## Environment Variables

To run this project, you will need to add the following environment variables to your .env file

`SUPABASE_URL`

`SUPABASE_KEY`

`OPENAI_API_KEY`

`OPENAI_ORG_ID`

`OPENAI_EMBEDDING_MODEL=text-embedding-ada-002`

## Usage

- Log into your Supabase account and create x number of ai_characters as well as atleast 1 user
- Copy your new Users id
- Make an http request to `localhost:3000/${ai_character_id}`
- Add a body to the request that includes the following:

```json
{
  "message": "Any string you want",
  "uid": "userId"
}
```

- Send request
