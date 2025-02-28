import UserModel from "../models/user";
import "dotenv/config";
import { hashValue } from "./bcrypt";

const fakeUsers = [
  {
    email: "Mackenzie.Goldner86@gmail.com",
    username: "Rafael_Farrell",
    password: "Jewell West",
    profilePic: "https://randomuser.me/api/portraits/women/1.jpg",
  },
  {
    email: "Karina_Cummerata@gmail.com",
    username: "Leann84",
    password: "Ms. Nicolette Farrell",
    profilePic: "https://randomuser.me/api/portraits/women/2.jpg",
  },
  {
    email: "Dariana.Morissette@yahoo.com",
    username: "Eden_Rowe70",
    password: "Ms. Ezequiel Bradtke",
    profilePic: "https://randomuser.me/api/portraits/women/3.jpg",
  },
  {
    email: "Osvaldo_Wilderman@hotmail.com",
    username: "Orville_DAmore",
    password: "Tillman Gottlieb",
    profilePic: "https://randomuser.me/api/portraits/women/4.jpg",
  },
  {
    email: "Gisselle.Kuhlman45@hotmail.com",
    username: "Caitlyn_Lang",
    password: "Annabelle Shields",
    profilePic: "https://randomuser.me/api/portraits/women/5.jpg",
  },
  {
    email: "Peggie_Lynch66@hotmail.com",
    username: "Conrad.Lemke",
    password: "Verona Upton PhD",
    profilePic: "https://randomuser.me/api/portraits/women/6.jpg",
  },
  {
    email: "Pansy.Adams9@gmail.com",
    username: "Vicenta6",
    password: "Mrs. Helen Parisian",
    profilePic: "https://randomuser.me/api/portraits/women/7.jpg",
  },
  {
    email: "Lina.Schumm53@hotmail.com",
    username: "Deven.Dare",
    password: "Lilian Dooley",
    profilePic: "https://randomuser.me/api/portraits/women/8.jpg",
  },
  {
    email: "Issac.OConnell80@hotmail.com",
    username: "Mariano_Brakus42",
    password: "Cali Heidenreich",
    profilePic: "https://randomuser.me/api/portraits/men/1.jpg",
  },
  {
    email: "Vita44@yahoo.com",
    username: "Walter90",
    password: "Mrs. Paxton Rosenbaum",
    profilePic: "https://randomuser.me/api/portraits/men/2.jpg",
  },
  {
    email: "Baby.Ziemann30@hotmail.com",
    username: "Laisha.Crona",
    password: "Hortense Ankunding",
    profilePic: "https://randomuser.me/api/portraits/men/3.jpg",
  },
  {
    email: "Ocie.Kuhn76@gmail.com",
    username: "Giuseppe_Funk86",
    password: "Devan Kassulke V",
    profilePic: "https://randomuser.me/api/portraits/men/4.jpg",
  },
  {
    email: "Isabell_Nitzsche3@gmail.com",
    username: "Rodger.Schimmel",
    password: "Alverta Skiles",
    profilePic: "https://randomuser.me/api/portraits/men/5.jpg",
  },
  {
    email: "Keeley.Bode@yahoo.com",
    username: "Ora4",
    password: "Adela Gislason",
    profilePic: "https://randomuser.me/api/portraits/men/6.jpg",
  },
  {
    email: "Delaney95@hotmail.com",
    username: "Bobbie86",
    password: "Diana Morar",
    profilePic: "https://randomuser.me/api/portraits/men/7.jpg",
  },
  {
    email: "Katrina.Senger15@gmail.com",
    username: "Travis57",
    password: "Nicolas Littel",
    profilePic: "https://randomuser.me/api/portraits/men/8.jpg",
  },
];

const seedDb = async () => {
  try {
    const hashedUsers = await Promise.all(
      fakeUsers.map(async (user) => ({
        ...user,
        password: await hashValue(user.password),
      }))
    );
    await UserModel.insertMany(hashedUsers);
    console.log("Database seeded successfully");
  } catch (error: any) {
    console.error("Error seeding database", error);
  }
};

export default seedDb;
