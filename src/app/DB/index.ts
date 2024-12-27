import config from "../config";
import { USER_ROLE } from "../modules/user/user.const";
import { User } from "../modules/user/user.model";

const superUser = {
  id: "0001",
  email: "khanana900@gmail.com",
  password: config.superAdminPassword,
  needsChangePassword: false,
  role: USER_ROLE.superAdmin,
  status: "in-progress",
  isDeleted: false,
};

const seedSuperAdmin = async () => {
  // When database is connected, we will check is there  any user who is super admin

  const isSuperAdminExists = await User.findOne({ role: USER_ROLE.superAdmin });

  if (!isSuperAdminExists) {
    await User.create(superUser);
  }
};

export default seedSuperAdmin;
