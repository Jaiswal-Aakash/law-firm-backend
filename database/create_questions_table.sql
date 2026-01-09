-- Create tblPetitionTemplateQuestions table
-- This table stores questions for each petition template

CREATE TABLE IF NOT EXISTS "tblPetitionTemplateQuestions" (
    "tq_id" SERIAL PRIMARY KEY,
    "ptm_id" VARCHAR(50) NOT NULL,
    "question_id" VARCHAR(100) NOT NULL,
    "question_text" TEXT NOT NULL,
    "question_type" VARCHAR(50) NOT NULL, -- text, textarea, number, dropdown
    "is_required" BOOLEAN DEFAULT true,
    "placeholder" TEXT,
    "options" JSONB, -- For dropdown questions, store array of options
    "display_order" INTEGER DEFAULT 0,
    "created_on" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    "created_by" VARCHAR(255),
    CONSTRAINT fk_template_question FOREIGN KEY ("ptm_id") REFERENCES "tblPetitionTemplateMaster"("ptm_id") ON DELETE CASCADE,
    CONSTRAINT uk_template_question UNIQUE ("ptm_id", "question_id")
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_template_questions_ptm_id ON "tblPetitionTemplateQuestions"("ptm_id");
CREATE INDEX IF NOT EXISTS idx_template_questions_display_order ON "tblPetitionTemplateQuestions"("ptm_id", "display_order");

-- Add comment for documentation
COMMENT ON TABLE "tblPetitionTemplateQuestions" IS 'Stores questions for each petition template';
COMMENT ON COLUMN "tblPetitionTemplateQuestions"."question_id" IS 'Unique identifier for the question (e.g., num_accused, court_name)';
COMMENT ON COLUMN "tblPetitionTemplateQuestions"."question_type" IS 'Type of input: text, textarea, number, dropdown';
COMMENT ON COLUMN "tblPetitionTemplateQuestions"."options" IS 'JSON array of options for dropdown questions';

