-- CreateTable
CREATE TABLE IF NOT EXISTS sessions  (

    id INT(11)  UNSIGNED AUTO_INCREMENT,
    sessionId VARCHAR(128) NOT NULL,
    UNIQUE INDEX `sessions_sessionId`(sessionId),
    PRIMARY KEY (id)

) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
-- CreateTable
CREATE TABLE session_details(
    sessionId  INT(11) UNSIGNED NOT NULL ,
    id varchar(128)  NOT NULL,
    data TEXT  NOT NULL  ,
    CONSTRAINT `fk_details_session` FOREIGN KEY (sessionId) REFERENCES sessions(id) 
    ON DELETE CASCADE
    ON UPDATE CASCADE,
    UNIQUE INDEX `unique_id_per_session_id`(sessionId, id)
)ENGINE=INNODB DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
-- CeateTable
CREATE TABLE contacts (
 sessionId  INT(11) UNSIGNED NOT NULL,
 name varchar(32),
 wtId  varchar(64)  NOT NULL,
 CONSTRAINT `fk_contact_session` FOREIGN KEY (sessionId) REFERENCES sessions(id) 
    ON DELETE CASCADE
    ON UPDATE CASCADE,
    UNIQUE INDEX `unique_sessionId_per_wtId`(sessionId,wtId)
)ENGINE=INNODB DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;