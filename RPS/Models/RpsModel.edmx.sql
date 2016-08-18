
-- --------------------------------------------------
-- Entity Designer DDL Script for SQL Server 2005, 2008, 2012 and Azure
-- --------------------------------------------------
-- Date Created: 05/14/2016 11:34:33
-- Generated from EDMX file: D:\Учеба\Универ\1 Семестр\Курсовой RPS\RPS1\RPS\Models\RpsModel.edmx
-- --------------------------------------------------

SET QUOTED_IDENTIFIER OFF;
GO
USE [DB_9DF713_RPS];
GO
IF SCHEMA_ID(N'dbo') IS NULL EXECUTE(N'CREATE SCHEMA [dbo]');
GO

-- --------------------------------------------------
-- Dropping existing FOREIGN KEY constraints
-- --------------------------------------------------

IF OBJECT_ID(N'[dbo].[FK_Call_Agent]', 'F') IS NOT NULL
    ALTER TABLE [dbo].[Call] DROP CONSTRAINT [FK_Call_Agent];
GO
IF OBJECT_ID(N'[dbo].[FK_Call_CallStatus]', 'F') IS NOT NULL
    ALTER TABLE [dbo].[Call] DROP CONSTRAINT [FK_Call_CallStatus];
GO
IF OBJECT_ID(N'[dbo].[FK_Call_Customer]', 'F') IS NOT NULL
    ALTER TABLE [dbo].[Call] DROP CONSTRAINT [FK_Call_Customer];
GO
IF OBJECT_ID(N'[dbo].[fk_RoleId]', 'F') IS NOT NULL
    ALTER TABLE [dbo].[webpages_UsersInRoles] DROP CONSTRAINT [fk_RoleId];
GO
IF OBJECT_ID(N'[dbo].[fk_UserId]', 'F') IS NOT NULL
    ALTER TABLE [dbo].[webpages_UsersInRoles] DROP CONSTRAINT [fk_UserId];
GO

-- --------------------------------------------------
-- Dropping existing tables
-- --------------------------------------------------

IF OBJECT_ID(N'[dbo].[Call]', 'U') IS NOT NULL
    DROP TABLE [dbo].[Call];
GO
IF OBJECT_ID(N'[dbo].[CallArchivedReason]', 'U') IS NOT NULL
    DROP TABLE [dbo].[CallArchivedReason];
GO
IF OBJECT_ID(N'[dbo].[CallStatus]', 'U') IS NOT NULL
    DROP TABLE [dbo].[CallStatus];
GO
IF OBJECT_ID(N'[dbo].[User]', 'U') IS NOT NULL
    DROP TABLE [dbo].[User];
GO
IF OBJECT_ID(N'[dbo].[webpages_Roles]', 'U') IS NOT NULL
    DROP TABLE [dbo].[webpages_Roles];
GO
IF OBJECT_ID(N'[dbo].[webpages_UsersInRoles]', 'U') IS NOT NULL
    DROP TABLE [dbo].[webpages_UsersInRoles];
GO

-- --------------------------------------------------
-- Creating all tables
-- --------------------------------------------------

-- Creating table 'Call'
CREATE TABLE [dbo].[Call] (
    [id] int IDENTITY(1,1) NOT NULL,
    [Customer] int  NOT NULL,
    [Agent] int  NULL,
    [CallText] nvarchar(max)  NOT NULL,
    [DateCreated] datetime  NOT NULL,
    [Status] int  NOT NULL,
    [DateSolved] datetime  NULL,
    [DateArchived] datetime  NULL,
    [Answer] nvarchar(max)  NULL,
    [Reason] nvarchar(max)  NULL,
    [IsDeleted] bit  NOT NULL
);
GO

-- Creating table 'CallArchivedReason'
CREATE TABLE [dbo].[CallArchivedReason] (
    [id] int IDENTITY(1,1) NOT NULL,
    [Reason] nvarchar(max)  NOT NULL
);
GO

-- Creating table 'CallStatus'
CREATE TABLE [dbo].[CallStatus] (
    [id] int IDENTITY(1,1) NOT NULL,
    [Status] nvarchar(max)  NOT NULL
);
GO

-- Creating table 'User'
CREATE TABLE [dbo].[User] (
    [id] int IDENTITY(1,1) NOT NULL,
    [Login] nvarchar(50)  NOT NULL,
    [MPhone] nvarchar(50)  NULL,
    [Email] nvarchar(50)  NULL,
    [UserFN] nvarchar(50)  NULL,
    [UserLN] nvarchar(50)  NULL,
    [Birthday] datetime  NULL,
    [IsActive] bit  NOT NULL
);
GO

-- Creating table 'webpages_Roles'
CREATE TABLE [dbo].[webpages_Roles] (
    [RoleId] int IDENTITY(1,1) NOT NULL,
    [RoleName] nvarchar(256)  NOT NULL
);
GO

-- Creating table 'webpages_UsersInRoles'
CREATE TABLE [dbo].[webpages_UsersInRoles] (
    [UserId] int  NOT NULL,
    [RoleId] int  NOT NULL
);
GO

-- --------------------------------------------------
-- Creating all PRIMARY KEY constraints
-- --------------------------------------------------

-- Creating primary key on [id] in table 'Call'
ALTER TABLE [dbo].[Call]
ADD CONSTRAINT [PK_Call]
    PRIMARY KEY CLUSTERED ([id] ASC);
GO

-- Creating primary key on [id] in table 'CallArchivedReason'
ALTER TABLE [dbo].[CallArchivedReason]
ADD CONSTRAINT [PK_CallArchivedReason]
    PRIMARY KEY CLUSTERED ([id] ASC);
GO

-- Creating primary key on [id] in table 'CallStatus'
ALTER TABLE [dbo].[CallStatus]
ADD CONSTRAINT [PK_CallStatus]
    PRIMARY KEY CLUSTERED ([id] ASC);
GO

-- Creating primary key on [id] in table 'User'
ALTER TABLE [dbo].[User]
ADD CONSTRAINT [PK_User]
    PRIMARY KEY CLUSTERED ([id] ASC);
GO

-- Creating primary key on [RoleId] in table 'webpages_Roles'
ALTER TABLE [dbo].[webpages_Roles]
ADD CONSTRAINT [PK_webpages_Roles]
    PRIMARY KEY CLUSTERED ([RoleId] ASC);
GO

-- Creating primary key on [RoleId], [UserId] in table 'webpages_UsersInRoles'
ALTER TABLE [dbo].[webpages_UsersInRoles]
ADD CONSTRAINT [PK_webpages_UsersInRoles]
    PRIMARY KEY CLUSTERED ([RoleId], [UserId] ASC);
GO

-- --------------------------------------------------
-- Creating all FOREIGN KEY constraints
-- --------------------------------------------------

-- Creating foreign key on [Agent] in table 'Call'
ALTER TABLE [dbo].[Call]
ADD CONSTRAINT [FK_Call_Agent]
    FOREIGN KEY ([Agent])
    REFERENCES [dbo].[User]
        ([id])
    ON DELETE NO ACTION ON UPDATE NO ACTION;
GO

-- Creating non-clustered index for FOREIGN KEY 'FK_Call_Agent'
CREATE INDEX [IX_FK_Call_Agent]
ON [dbo].[Call]
    ([Agent]);
GO

-- Creating foreign key on [Status] in table 'Call'
ALTER TABLE [dbo].[Call]
ADD CONSTRAINT [FK_Call_CallStatus]
    FOREIGN KEY ([Status])
    REFERENCES [dbo].[CallStatus]
        ([id])
    ON DELETE NO ACTION ON UPDATE NO ACTION;
GO

-- Creating non-clustered index for FOREIGN KEY 'FK_Call_CallStatus'
CREATE INDEX [IX_FK_Call_CallStatus]
ON [dbo].[Call]
    ([Status]);
GO

-- Creating foreign key on [Customer] in table 'Call'
ALTER TABLE [dbo].[Call]
ADD CONSTRAINT [FK_Call_Customer]
    FOREIGN KEY ([Customer])
    REFERENCES [dbo].[User]
        ([id])
    ON DELETE NO ACTION ON UPDATE NO ACTION;
GO

-- Creating non-clustered index for FOREIGN KEY 'FK_Call_Customer'
CREATE INDEX [IX_FK_Call_Customer]
ON [dbo].[Call]
    ([Customer]);
GO

-- Creating foreign key on [RoleId] in table 'webpages_UsersInRoles'
ALTER TABLE [dbo].[webpages_UsersInRoles]
ADD CONSTRAINT [FK_webpages_UsersInRoles_webpages_Roles]
    FOREIGN KEY ([RoleId])
    REFERENCES [dbo].[webpages_Roles]
        ([RoleId])
    ON DELETE NO ACTION ON UPDATE NO ACTION;
GO

-- Creating foreign key on [UserId] in table 'webpages_UsersInRoles'
ALTER TABLE [dbo].[webpages_UsersInRoles]
ADD CONSTRAINT [FK_webpages_UsersInRoles_User]
    FOREIGN KEY ([UserId])
    REFERENCES [dbo].[User]
        ([id])
    ON DELETE NO ACTION ON UPDATE NO ACTION;
GO

-- Creating non-clustered index for FOREIGN KEY 'FK_webpages_UsersInRoles_User'
CREATE INDEX [IX_FK_webpages_UsersInRoles_User]
ON [dbo].[webpages_UsersInRoles]
    ([UserId]);
GO

-- --------------------------------------------------
-- Script has ended
-- --------------------------------------------------