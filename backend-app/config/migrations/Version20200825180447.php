<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20200825180447 extends AbstractMigration
{
    public function getDescription() : string
    {
        return '';
    }

    public function up(Schema $schema) : void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE TABLE messages (id_message UUID NOT NULL, id_user UUID NOT NULL, message TEXT NOT NULL, created_at TIMESTAMP(0) WITH TIME ZONE NOT NULL, PRIMARY KEY(id_message))');
        $this->addSql('CREATE INDEX IDX_DB021E966B3CA4B ON messages (id_user)');
        $this->addSql('COMMENT ON COLUMN messages.id_message IS \'(DC2Type:uuid)\'');
        $this->addSql('COMMENT ON COLUMN messages.id_user IS \'(DC2Type:uuid)\'');
        $this->addSql('COMMENT ON COLUMN messages.created_at IS \'(DC2Type:datetimetz_immutable)\'');
        $this->addSql('CREATE TABLE users (id_user UUID NOT NULL, email VARCHAR(180) NOT NULL, password VARCHAR(128) NOT NULL, first_name VARCHAR(60) NOT NULL, last_name VARCHAR(60) NOT NULL, timezone VARCHAR(30) NOT NULL, roles JSON NOT NULL, created_at TIMESTAMP(0) WITH TIME ZONE NOT NULL, PRIMARY KEY(id_user))');
        $this->addSql('CREATE UNIQUE INDEX UNIQ_1483A5E9E7927C74 ON users (email)');
        $this->addSql('CREATE INDEX email_idx ON users (email)');
        $this->addSql('COMMENT ON COLUMN users.id_user IS \'(DC2Type:uuid)\'');
        $this->addSql('COMMENT ON COLUMN users.created_at IS \'(DC2Type:datetimetz_immutable)\'');
        $this->addSql('ALTER TABLE messages ADD CONSTRAINT FK_DB021E966B3CA4B FOREIGN KEY (id_user) REFERENCES users (id_user) NOT DEFERRABLE INITIALLY IMMEDIATE');
    }

    public function down(Schema $schema) : void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE SCHEMA public');
        $this->addSql('ALTER TABLE messages DROP CONSTRAINT FK_DB021E966B3CA4B');
        $this->addSql('DROP TABLE messages');
        $this->addSql('DROP TABLE users');
    }
}
