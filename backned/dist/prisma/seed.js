"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        // Create an admin user
        const adminUser = yield prisma.user.create({
            data: {
                name: 'Admin User',
                email: 'admin@example.com',
                phno: '1234567890',
                password: 'securepassword', // Ensure to hash passwords in production
                isEmailVerified: true,
                type: 'ADMIN',
            },
        });
        console.log('Admin User Created:', adminUser);
        // Create a club
        const club1 = yield prisma.club.create({
            data: {
                name: 'Swimming & water sports Club',
                description: 'Swimming & Water Sports club of the Tezpur University campus which take cares of the water borne activities in the campus. Swimming pool was come up in the campus in January 2018 and the club has organized events throughout the season and conducts at various levels. The club is to encourages love for Swimming and kids to take up Swimming as a part of a healthy lifestyle and a positive environment. The primary goal of the club is representing the Inter University, National and International level Tournaments in the future.',
                isApplicationPublished: false,
            },
        });
        console.log('Club Created:', club1);
        const club2 = yield prisma.club.create({
            data: {
                name: 'Gymnasium Club',
                description: 'Gymnasium, large room used and equipped for the performance of various sports. Tezpur University Gymnasium club exists for both ladies and gents. The Gymnasium club in Tezpur University is one of the sincerest clubs in the campus. The club is equipped with international standard equipment like treadmill, cross-trainer, multigym, barbells, plate weight etc. The club is Responsible for Conducting Fitness events like Body Building, powerlifting, weightlifting, tug-of-war and arm-wrestling Competition.',
                isApplicationPublished: false,
            },
        });
        console.log('Club Created:', club2);
    });
}
main()
    .catch(e => {
    console.error(e);
    process.exit(1);
})
    .finally(() => __awaiter(void 0, void 0, void 0, function* () {
    yield prisma.$disconnect();
}));
