-- Created by running pg_dump -U quarkus -p 32785 -d quarkus -h localhost --schema-only > database_schema_dump.sql
-- on a version of the application running in dev mode with auto ddl.

CREATE TABLE public.ingredient
(
    id   uuid PRIMARY KEY,
    name character varying(255)
);

CREATE TABLE public.recipe
(
    id      uuid PRIMARY KEY,
    name    character varying(255),
    youtube character varying(255),
    description TEXT
);

CREATE TABLE public.recipeingredient
(
    amount     integer NOT NULL,
    ingredient uuid    NOT NULL,
    recipe     uuid    NOT NULL,
    unit       character varying(255),

    CONSTRAINT fk_ingredient
        FOREIGN KEY (ingredient)
            REFERENCES ingredient (id),

    CONSTRAINT fk_recipe
        FOREIGN KEY (recipe)
            REFERENCES recipe (id)
);
