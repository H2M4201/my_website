BEGIN TRY

BEGIN TRAN;

-- CreateTable
CREATE TABLE [dbo].[Section] (
    [id] INT NOT NULL IDENTITY(1,1),
    [SectionName] NVARCHAR(100) NOT NULL,
    [Description] NVARCHAR(500),
    [Href] NVARCHAR(255),
    CONSTRAINT [Section_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[Contact] (
    [id] INT NOT NULL IDENTITY(1,1),
    [ContactType] NVARCHAR(50) NOT NULL,
    [ContactInfo] NVARCHAR(255) NOT NULL,
    [Icon] NVARCHAR(100),
    CONSTRAINT [Contact_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[Blog] (
    [id] INT NOT NULL IDENTITY(1,1),
    [Title] NVARCHAR(255) NOT NULL,
    [Description] NVARCHAR(1000),
    [Content] NVARCHAR(max),
    [IsActive] BIT NOT NULL CONSTRAINT [Blog_IsActive_df] DEFAULT 1,
    [SortOrder] INT NOT NULL CONSTRAINT [Blog_SortOrder_df] DEFAULT 0,
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [Blog_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    [updatedAt] DATETIME2 NOT NULL,
    CONSTRAINT [Blog_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[BlogCategory] (
    [id] INT NOT NULL IDENTITY(1,1),
    [CategoryName] NVARCHAR(255) NOT NULL,
    [SortOrder] INT NOT NULL CONSTRAINT [BlogCategory_SortOrder_df] DEFAULT 0,
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [BlogCategory_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    [updatedAt] DATETIME2 NOT NULL,
    CONSTRAINT [BlogCategory_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[Trip] (
    [id] INT NOT NULL IDENTITY(1,1),
    [Title] NVARCHAR(255) NOT NULL,
    [Time] NVARCHAR(100),
    [Location] NVARCHAR(255),
    [Content] NVARCHAR(max),
    CONSTRAINT [Trip_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[Recipe] (
    [id] INT NOT NULL IDENTITY(1,1),
    [Name] NVARCHAR(255) NOT NULL,
    [Description] NVARCHAR(1000),
    CONSTRAINT [Recipe_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[Experience] (
    [id] INT NOT NULL IDENTITY(1,1),
    [Title] NVARCHAR(255) NOT NULL,
    [Company] NVARCHAR(255) NOT NULL,
    [Period] NVARCHAR(100) NOT NULL,
    [Achievement] NVARCHAR(1000),
    [IsActive] BIT NOT NULL CONSTRAINT [Experience_IsActive_df] DEFAULT 1,
    [SortOrder] INT NOT NULL CONSTRAINT [Experience_SortOrder_df] DEFAULT 0,
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [Experience_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    [updatedAt] DATETIME2 NOT NULL,
    CONSTRAINT [Experience_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[JobDescription] (
    [id] INT NOT NULL IDENTITY(1,1),
    [Description] NVARCHAR(1000) NOT NULL,
    [SortOrder] INT NOT NULL CONSTRAINT [JobDescription_SortOrder_df] DEFAULT 0,
    [experienceId] INT NOT NULL,
    CONSTRAINT [JobDescription_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[ExperienceSkill] (
    [id] INT NOT NULL IDENTITY(1,1),
    [Skill] NVARCHAR(100) NOT NULL,
    [SortOrder] INT NOT NULL CONSTRAINT [ExperienceSkill_SortOrder_df] DEFAULT 0,
    [experienceId] INT NOT NULL,
    CONSTRAINT [ExperienceSkill_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[ExpertiseCategory] (
    [id] INT NOT NULL IDENTITY(1,1),
    [Category] NVARCHAR(100) NOT NULL,
    [SortOrder] INT NOT NULL CONSTRAINT [ExpertiseCategory_SortOrder_df] DEFAULT 0,
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [ExpertiseCategory_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    [updatedAt] DATETIME2 NOT NULL,
    CONSTRAINT [ExpertiseCategory_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[ExpertiseSkill] (
    [id] INT NOT NULL IDENTITY(1,1),
    [Skill] NVARCHAR(100) NOT NULL,
    [SortOrder] INT NOT NULL CONSTRAINT [ExpertiseSkill_SortOrder_df] DEFAULT 0,
    [expertiseCategoryId] INT NOT NULL,
    CONSTRAINT [ExpertiseSkill_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[AdminUser] (
    [id] INT NOT NULL IDENTITY(1,1),
    [username] NVARCHAR(100) NOT NULL,
    [password] NVARCHAR(255) NOT NULL,
    [email] NVARCHAR(255),
    [name] NVARCHAR(255),
    [roleId] INT,
    [failedLoginAttempts] INT NOT NULL CONSTRAINT [AdminUser_failedLoginAttempts_df] DEFAULT 0,
    [lockedUntil] DATETIME2,
    [passwordChangedAt] DATETIME2,
    [passwordResetToken] NVARCHAR(255),
    [passwordResetTokenExpires] DATETIME2,
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [AdminUser_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    [updatedAt] DATETIME2 NOT NULL,
    CONSTRAINT [AdminUser_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [AdminUser_username_key] UNIQUE NONCLUSTERED ([username])
);

-- AddForeignKey
ALTER TABLE [dbo].[JobDescription] ADD CONSTRAINT [JobDescription_experienceId_fkey] FOREIGN KEY ([experienceId]) REFERENCES [dbo].[Experience]([id]) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[ExperienceSkill] ADD CONSTRAINT [ExperienceSkill_experienceId_fkey] FOREIGN KEY ([experienceId]) REFERENCES [dbo].[Experience]([id]) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[ExpertiseSkill] ADD CONSTRAINT [ExpertiseSkill_expertiseCategoryId_fkey] FOREIGN KEY ([expertiseCategoryId]) REFERENCES [dbo].[ExpertiseCategory]([id]) ON DELETE CASCADE ON UPDATE CASCADE;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
