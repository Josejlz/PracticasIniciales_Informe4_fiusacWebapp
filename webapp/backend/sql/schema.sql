CREATE TABLE estudiante (
    id          INT PRIMARY KEY,
    nombres     VARCHAR(50)  NOT NULL,
    apellidos   VARCHAR(50)  NOT NULL,
    email       VARCHAR(100) NOT NULL UNIQUE,
    password    VARCHAR(100) NOT NULL  
);
 
CREATE TABLE curso (
    id     INT PRIMARY KEY,
    nombre VARCHAR(75) NOT NULL
);
 
CREATE TABLE estudiante_curso (
    "estudianteId" INT NOT NULL,
    "cursoId"      INT NOT NULL,
    PRIMARY KEY ("estudianteId", "cursoId"),
    FOREIGN KEY ("estudianteId") REFERENCES estudiante(id) ON DELETE CASCADE,
    FOREIGN KEY ("cursoId")      REFERENCES curso(id)      ON DELETE CASCADE
);
 
CREATE TABLE catedratico (
    id        INT PRIMARY KEY,
    nombres   VARCHAR(50) NOT NULL,
    apellidos VARCHAR(50) NOT NULL
);
 
CREATE TABLE catedratico_curso (
    "idCatedratico" INT NOT NULL,
    "idCurso"       INT NOT NULL,
    PRIMARY KEY ("idCurso", "idCatedratico"),
    FOREIGN KEY ("idCurso")       REFERENCES curso(id)       ON DELETE CASCADE,
    FOREIGN KEY ("idCatedratico") REFERENCES catedratico(id) ON DELETE CASCADE
);
 
-- PostgreSQL does not support MySQL's ENUM syntax.
-- Use a CHECK constraint (or a separate ENUM type) instead.
CREATE TYPE post_tipo AS ENUM ('curso', 'catedratico');
 
CREATE TABLE post (
    id              INT  NOT NULL PRIMARY KEY SERIAL,
    "estudianteId"  INT  NOT NULL,
    "cursoId"       INT,
    tipo            post_tipo,
    "catedraticoId" INT,
    titulo          VARCHAR(100) NOT NULL,
    contenido       TEXT         NOT NULL,
    fecha           TIMESTAMP    DEFAULT CURRENT_TIMESTAMP,
 
    FOREIGN KEY ("estudianteId")  REFERENCES estudiante(id)  ON DELETE CASCADE,
    FOREIGN KEY ("cursoId")       REFERENCES curso(id)        ON DELETE CASCADE,
    FOREIGN KEY ("catedraticoId") REFERENCES catedratico(id) ON DELETE CASCADE,
 
    CONSTRAINT "checkSujetoPost" CHECK (
        (tipo = 'curso'       AND "cursoId"       IS NOT NULL AND "catedraticoId" IS NULL) OR
        (tipo = 'catedratico' AND "estudianteId"  IS NOT NULL AND "cursoId"       IS NULL)
    )
);
 
CREATE TABLE comentario (
    id             INT  NOT NULL PRIMARY KEY,
    "estudianteId" INT  NOT NULL,
    "postId"       INT  NOT NULL,
    contenido      TEXT NOT NULL,
    fecha          TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
 
    FOREIGN KEY ("estudianteId") REFERENCES estudiante(id),
    FOREIGN KEY ("postId")       REFERENCES post(id)
);