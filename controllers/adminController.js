// Admin Controller - Uses existing database tables:
// - tblLawFirmDetails (via LawFirm model) for law firms
// - tblUsers (via UserTbl model) for advocates/users
// Relationship: tblUsers.law_firm → tblLawFirmDetails.l_id
const LawFirm = require('../models/LawFirm');
const UserTbl = require('../models/UserTbl');
const { sendActivationEmail } = require('../services/emailService');

// Dummy data for testing when no real data is available
const getDummyFirmsData = () => {
  return {
    firms: [
      {
        id: 'LF001',
        firmName: 'ABC Law Associates',
        address: '123 Main Street, Coimbatore - 641001',
        phone: '0422-1234567',
        email: 'info@abclaw.com',
        advocates: [
          {
            id: 'USR001',
            name: 'John Doe',
            email: 'john.doe@abclaw.com',
            phone: '9876543210',
            createdAt: new Date().toISOString()
          },
          {
            id: 'USR002',
            name: 'Jane Smith',
            email: 'jane.smith@abclaw.com',
            phone: '9876543211',
            createdAt: new Date().toISOString()
          }
        ],
        advocateCount: 2
      },
      {
        id: 'LF002',
        firmName: 'XYZ Legal Services',
        address: '456 Park Avenue, Coimbatore - 641002',
        phone: '0422-2345678',
        email: 'contact@xyzlegal.com',
        advocates: [
          {
            id: 'USR003',
            name: 'Sarah Williams',
            email: 'sarah.williams@xyzlegal.com',
            phone: '9876543213',
            createdAt: new Date().toISOString()
          }
        ],
        advocateCount: 1
      }
    ]
  };
};

// Get all firms with their advocates (with filtering)
const getAllFirmsWithAdvocates = async (req, res) => {
  try {
    const { firmName } = req.query; // Filter by firm name
    
    let firms = await LawFirm.findAll();
    
    // Apply firm name filter if provided
    if (firmName && firmName.trim()) {
      const searchTerm = firmName.trim().toLowerCase();
      firms = firms.filter(firm => 
        firm.l_name && firm.l_name.toLowerCase().includes(searchTerm)
      );
    }
    
    // If no firms in database, return dummy data
    if (firms.length === 0 && !firmName) {
      console.log('ℹ️  No firms found in database, returning dummy data for testing');
      const dummyData = getDummyFirmsData();
      return res.json({
        success: true,
        data: {
          firms: dummyData.firms
        },
        count: dummyData.firms.length,
        isDummyData: true
      });
    }
    
    // Get advocates for each firm
    const firmsWithAdvocates = await Promise.all(
      firms.map(async (firm) => {
        const advocates = await LawFirm.getAdvocatesByFirmId(firm.l_id);
        return {
          ...firm.toJSON(),
          advocates: advocates,
          advocateCount: advocates.length
        };
      })
    );

    res.json({
      success: true,
      data: {
        firms: firmsWithAdvocates
      },
      count: firmsWithAdvocates.length,
      isDummyData: false
    });
  } catch (error) {
    console.error('Error fetching firms with advocates:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching firms with advocates',
      error: error.message
    });
  }
};

// Get all advocates (across all firms) with search
const getAllAdvocates = async (req, res) => {
  try {
    const { search } = req.query; // Search by name, email, or phone
    
    let advocates = await UserTbl.findAllAdvocates();
    
    // Apply search filter if provided
    if (search && search.trim()) {
      const searchTerm = search.trim().toLowerCase();
      advocates = advocates.filter(adv => 
        (adv.name && adv.name.toLowerCase().includes(searchTerm)) ||
        (adv.email && adv.email.toLowerCase().includes(searchTerm)) ||
        (adv.phone && adv.phone.toLowerCase().includes(searchTerm))
      );
    }
    
    res.json({
      success: true,
      data: advocates,
      count: advocates.length
    });
  } catch (error) {
    console.error('Error fetching advocates:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching advocates',
      error: error.message
    });
  }
};

// Generate a random temporary password
function generateTemporaryPassword() {
  // Generate a secure random password with 12 characters
  // Includes uppercase, lowercase, numbers, and special characters
  const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const lowercase = 'abcdefghijklmnopqrstuvwxyz';
  const numbers = '0123456789';
  const special = '!@#$%&*';
  const allChars = uppercase + lowercase + numbers + special;
  
  let password = '';
  // Ensure at least one character from each category
  password += uppercase[Math.floor(Math.random() * uppercase.length)];
  password += lowercase[Math.floor(Math.random() * lowercase.length)];
  password += numbers[Math.floor(Math.random() * numbers.length)];
  password += special[Math.floor(Math.random() * special.length)];
  
  // Fill the rest randomly
  for (let i = password.length; i < 12; i++) {
    password += allChars[Math.floor(Math.random() * allChars.length)];
  }
  
  // Shuffle the password
  return password.split('').sort(() => Math.random() - 0.5).join('');
}

// Activate a user
const activateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await UserTbl.findById(id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Generate a new temporary password
    const temporaryPassword = generateTemporaryPassword();
    
    // Update user password with the new temporary password (hashed)
    await UserTbl.updatePassword(id, temporaryPassword);

    // Update user status to Active
    await UserTbl.updateStatus(id, 'Active');

    // Refresh user object to get updated status
    const updatedUser = await UserTbl.findById(id);

    // Send activation email with credentials (plain text temporary password)
    try {
      if (user.email) {
        const userEmailId = user.email;
        
        await sendActivationEmail(user.email, user.name, userEmailId, temporaryPassword);
        console.log(`✅ Activation email sent to ${user.email} with temporary password`);
      }
    } catch (emailError) {
      console.error('⚠️  Failed to send activation email:', emailError);
      // Don't fail the request if email fails, just log it
    }

    res.json({
      success: true,
      message: 'User activated successfully. Activation email sent with temporary password.',
      data: updatedUser ? updatedUser.toJSON() : user.toJSON()
    });
  } catch (error) {
    console.error('Error activating user:', error);
    res.status(500).json({
      success: false,
      message: 'Error activating user',
      error: error.message
    });
  }
};

// Deactivate a user
const deactivateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await UserTbl.findById(id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Update user status to Inactive
    await UserTbl.updateStatus(id, 'Inactive');

    // Refresh user object to get updated status
    const updatedUser = await UserTbl.findById(id);

    res.json({
      success: true,
      message: 'User deactivated successfully',
      data: updatedUser ? updatedUser.toJSON() : user.toJSON()
    });
  } catch (error) {
    console.error('Error deactivating user:', error);
    res.status(500).json({
      success: false,
      message: 'Error deactivating user',
      error: error.message
    });
  }
};

// Get user by ID with firm details
const getUserWithFirm = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await UserTbl.findById(id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    let firm = null;
    if (user.lawFirm) {
      firm = await LawFirm.findById(user.lawFirm);
    }

    res.json({
      success: true,
      data: {
        ...user.toJSON(),
        firm: firm ? firm.toJSON() : null
      }
    });
  } catch (error) {
    console.error('Error fetching user with firm:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching user with firm',
      error: error.message
    });
  }
};

module.exports = {
  getAllFirmsWithAdvocates,
  getAllAdvocates,
  activateUser,
  deactivateUser,
  getUserWithFirm
};
