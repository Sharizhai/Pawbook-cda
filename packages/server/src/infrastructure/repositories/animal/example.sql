-- Exemple d'exécution avec des valeurs réelles :

INSERT INTO "animals" (
    "id",
    "ownerId",
    "name",
    "type",
    "race",
    "age",
    "picture",
    "description",
    "createdAt",
    "updatedAt"
)
VALUES (
           '550e8400-e29b-41d4-a716-446655440000',       -- animal.id
           '6ba7b810-9dad-11d1-80b4-00c04fd430c8',  -- animal.ownerId
           'Rex',                                     -- animal.name
           'Chien',                                    -- animal.type
           'Labrador',                                 -- animal.race
           5,                                           -- animal.age
           'https://example.com/rex.jpg',            -- animal.picture
           'Un adorable labrador très joueur',    -- animal.description
           '2025-01-23 10:30:00',                  -- animal.createdAt
           NOW()                                   -- updatedAt
       )
ON CONFLICT ("id")
    DO UPDATE SET
                  "name" = EXCLUDED."name",
                  "type" = EXCLUDED."type",
                  "race" = EXCLUDED."race",
                  "age" = EXCLUDED."age",
                  "picture" = EXCLUDED."picture",
                  "description" = EXCLUDED."description",
                  "updatedAt" = NOW()
RETURNING *;


-- Exemple d'exécution avec des valeurs réelles :

-- Début de la transaction
BEGIN;

-- 1. Mise à jour du post
UPDATE "posts"
SET
    "reportCount" = "reportCount" + 1,
    "moderationStatus" = 'PENDING'
WHERE "id" = 'a1b2c3d4-e5f6-7890-abcd-ef1234567890';

-- 2. Création du signalement
INSERT INTO "postReports" (
    "id",
    "postId",
    "reporterId",
    "reason",
    "description",
    "createdAt"
)
VALUES (
           '550e8400-e29b-41d4-a716-446655440000',           -- ID du signalement
           'a1b2c3d4-e5f6-7890-abcd-ef1234567890',        -- ID du post signalé
           '6ba7b810-9dad-11d1-80b4-00c04fd430c8',     -- ID de l'utilisateur qui signale
           'SPAM',                                       -- Raison du signalement
           'Ce post contient du spam publicitaire',   -- Description détaillée
           '2025-01-23 14:30:00'                       -- Date de création
       )
RETURNING *;

-- 3️⃣ Récupération des données complètes avec les relations
SELECT
    pr.*,
    u."id" AS "reporter_id",
    u."name" AS "reporter_name",
    u."firstName" AS "reporter_firstName",
    u."profilePicture" AS "reporter_profilePicture",
    p."id" AS "post_id",
    p."authorId" AS "post_authorId",
    p."textContent" AS "post_textContent",
    p."photoContent" AS "post_photoContent",
    p."reportCount" AS "post_reportCount",
    p."moderationStatus" AS "post_moderationStatus"
FROM "postReports" pr
         LEFT JOIN "users" u ON pr."reporterId" = u."id"
         LEFT JOIN "posts" p ON pr."postId" = p."id"
WHERE pr."id" = '550e8400-e29b-41d4-a716-446655440000';

-- Validation de la transaction
COMMIT;