BEGIN TRY

BEGIN TRAN;

-- AlterTable
ALTER TABLE [dbo].[Contact] DROP CONSTRAINT [Contact_updatedAt_df];

-- AlterTable
ALTER TABLE [dbo].[ExpertiseSkill] DROP CONSTRAINT [ExpertiseSkill_updatedAt_df];

-- AlterTable
ALTER TABLE [dbo].[JobDescription] DROP CONSTRAINT [JobDescription_updatedAt_df];

-- AlterTable
ALTER TABLE [dbo].[Recipe] DROP CONSTRAINT [Recipe_updatedAt_df];

-- AlterTable
ALTER TABLE [dbo].[Section] DROP CONSTRAINT [Section_updatedAt_df];

-- AlterTable
ALTER TABLE [dbo].[Trip] DROP CONSTRAINT [Trip_updatedAt_df];
ALTER TABLE [dbo].[Trip] ADD [Description] NVARCHAR(1000);

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
