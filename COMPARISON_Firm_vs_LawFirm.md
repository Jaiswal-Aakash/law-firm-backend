# Firm.js vs LawFirm.js Comparison

## Summary

There are **TWO different models** for law firms:

### 1. `Firm.js` Model
- **Table Used**: `firms` (created by `create_admin_tables.sql`)
- **Status**: ❌ **NOT USED** in active code
- **Purpose**: Was created for Admin Panel but never integrated
- **Table Structure**:
  - `id` (SERIAL PRIMARY KEY)
  - `firm_name`, `firm_address`, `firm_phone`, `firm_email`
  - `registration_number`, `status`
  - `created_at`, `updated_at`
- **Current State**: Table exists but is **EMPTY** (0 rows)

### 2. `LawFirm.js` Model ✅ (ACTIVE)
- **Table Used**: `tblLawFirmDetails` (existing table)
- **Status**: ✅ **ACTIVELY USED** in Admin Panel
- **Purpose**: Uses existing database table
- **Table Structure**:
  - `l_id` (VARCHAR PRIMARY KEY, e.g., "LF001")
  - `l_name`, `l_designation`, `l_address`
  - `l_phone_number`, `l_email`
  - `created_on`, `created_by`
- **Current State**: Table has data and is being used

## Which One is Used?

**Only `LawFirm.js` is used** in:
- `adminController.js` ✅
- `lawFirmController.js` ✅
- All API routes ✅

**`Firm.js` is NOT imported or used anywhere** in the active codebase.

## Recommendation

Since `Firm.js` is not used and we're using existing tables (`tblLawFirmDetails`), you can:
1. **Delete `Firm.js`** - It's not being used
2. **Keep it** - If you might need it in the future (but it uses wrong table)

The `firms` table was created by mistake during Admin Panel setup but is not being used.

