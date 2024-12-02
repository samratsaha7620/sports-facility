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
                email: 'admin@tezu.ac.in',
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
        const club3 = yield prisma.club.create({
            data: {
                name: 'Volleyball Club',
                description: 'Volleyball is a Popular Team Sports. In Tezpur University Volleyball club for both men’s and women’s volleyball team work hard throughout the year attending regular practice session with discipling, dedication, keep improving and to perform their best at the Sports meet and Club conduct Coaching Camp for AIU Tournament.',
                isApplicationPublished: false,
            },
        });
        console.log('Club Created:', club3);
        const club4 = yield prisma.club.create({
            data: {
                name: 'Cricket Club',
                description: 'Cricket is a bat ball game. In Tezpur University Cricket club help and motive the new players to learn the game and to perform their best at the game. Cricket club organized many events in the Tezpur University cricket ground. Every year cricket team participated in AIU tournament and produce many good players. Tezpur University has been MoU with the Assam cricket Association from August 2020 for 5 years.',
                isApplicationPublished: false,
            },
        });
        console.log('Club Created:', club4);
        const club5 = yield prisma.club.create({
            data: {
                name: 'Badminton Club',
                description: 'This Badminton sports is one of the major games which is played by almost the whole community. This game is so popular in Tezpur University and Badminton club organized many events for students and employees.',
                isApplicationPublished: false,
            },
        });
        console.log('Club Created:', club5);
        const club6 = yield prisma.club.create({
            data: {
                name: 'Basketball Club',
                description: 'Basketball is one of the most well-known and Practiced Sports in the world. Currently club have 2 nos. of synthetic hard court. Tezpur University Basketball Club manage the Basketball Activities of Tezpur University Campus. The Club conducts at Various Level of Basketball events in Tezpur University.',
                isApplicationPublished: false,
            },
        });
        console.log('Club Created:', club6);
        const club7 = yield prisma.club.create({
            data: {
                name: 'Football Club',
                description: 'Football provides mental and physical benefits through physical activity. In Tezpur University Football club conducts Camp for AIU Tournament. The club motive and help new players to learn the game. What set our Football club apart is our strong team spirits, dedication, camaraderie the amazing bonding the fun, frolic, and the constant on field.',
                isApplicationPublished: false,
            },
        });
        console.log('Club Created:', club7);
        const club8 = yield prisma.club.create({
            data: {
                name: 'Yoga & Aerobic Club',
                description: 'Yoga & Aerobic is not just an exercise. It is a process and system through which human being can find their highest possible potential. Yoga & Aerobic has been a movement in Tezpur University. Though the practice of yoga had been a compulsory part of in some Departments of the University and we have add on course run by Yoga Centre for every semester. Yoga & Aerobic club organized many events in Tezpur University around the year.',
                isApplicationPublished: false,
            },
        });
        console.log('Club Created:', club8);
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
