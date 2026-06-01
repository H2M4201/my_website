BEGIN TRY

BEGIN TRAN;

-- AlterTable: Contact
ALTER TABLE [dbo].[Contact] ADD [IsActive] BIT NOT NULL CONSTRAINT [Contact_IsActive_df] DEFAULT 1,
[createdAt] DATETIME2 NOT NULL CONSTRAINT [Contact_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
[updatedAt] DATETIME2 NOT NULL CONSTRAINT [Contact_updatedAt_df] DEFAULT CURRENT_TIMESTAMP;

-- AlterTable: ExpertiseCategory
ALTER TABLE [dbo].[ExpertiseCategory] ADD [IsActive] BIT NOT NULL CONSTRAINT [ExpertiseCategory_IsActive_df] DEFAULT 1;

-- AlterTable: ExpertiseSkill
ALTER TABLE [dbo].[ExpertiseSkill] ADD [IsActive] BIT NOT NULL CONSTRAINT [ExpertiseSkill_IsActive_df] DEFAULT 1,
[createdAt] DATETIME2 NOT NULL CONSTRAINT [ExpertiseSkill_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
[updatedAt] DATETIME2 NOT NULL CONSTRAINT [ExpertiseSkill_updatedAt_df] DEFAULT CURRENT_TIMESTAMP;

-- AlterTable: JobDescription
ALTER TABLE [dbo].[JobDescription] ADD [IsActive] BIT NOT NULL CONSTRAINT [JobDescription_IsActive_df] DEFAULT 1,
[createdAt] DATETIME2 NOT NULL CONSTRAINT [JobDescription_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
[updatedAt] DATETIME2 NOT NULL CONSTRAINT [JobDescription_updatedAt_df] DEFAULT CURRENT_TIMESTAMP;

-- AlterTable: Recipe
ALTER TABLE [dbo].[Recipe] ADD [IsActive] BIT NOT NULL CONSTRAINT [Recipe_IsActive_df] DEFAULT 1,
[createdAt] DATETIME2 NOT NULL CONSTRAINT [Recipe_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
[updatedAt] DATETIME2 NOT NULL CONSTRAINT [Recipe_updatedAt_df] DEFAULT CURRENT_TIMESTAMP;

-- AlterTable: Section
ALTER TABLE [dbo].[Section] ADD [IsActive] BIT NOT NULL CONSTRAINT [Section_IsActive_df] DEFAULT 1,
[createdAt] DATETIME2 NOT NULL CONSTRAINT [Section_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
[updatedAt] DATETIME2 NOT NULL CONSTRAINT [Section_updatedAt_df] DEFAULT CURRENT_TIMESTAMP;

-- AlterTable: Trip
ALTER TABLE [dbo].[Trip] ADD [IsActive] BIT NOT NULL CONSTRAINT [Trip_IsActive_df] DEFAULT 1,
[createdAt] DATETIME2 NOT NULL CONSTRAINT [Trip_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
[updatedAt] DATETIME2 NOT NULL CONSTRAINT [Trip_updatedAt_df] DEFAULT CURRENT_TIMESTAMP;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH