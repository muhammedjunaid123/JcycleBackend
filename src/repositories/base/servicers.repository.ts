import { HttpException, HttpStatus, Inject } from "@nestjs/common";
import { Model } from "mongoose";
import { User } from "src/users/entities/user.entity";
import * as bcrypt from 'bcrypt';
import { service, serviceOrder, servicer } from "src/servicer/servicers.type";
import { IServicerRepository } from "../interfaces/servicers-repository.interface";
import { promises } from "dns";

export class servicerRepository implements IServicerRepository {

    constructor(
        @Inject('SERVICER_MODEL')
        private _servicerModel: Model<servicer>,
        @Inject('SERVICE_MODEL')
        private _serviceModel: Model<service>,
        @Inject('SERVICEORDER_MODEL')
        private _serviceOrderModel: Model<serviceOrder>,
        @Inject('USER_MODEL')
        private _userModel: Model<User>,
        @Inject('CHAT_MODEL')
        private _chatModel: Model<any>,

    ) { }
    async addservicer(data: servicer): Promise<servicer> {

        try {
            const { name, email, phone, password } = data;
            const exUser = await this._servicerModel.findOne({ email: email })

            if (exUser) {

                throw new HttpException(
                    'the email has already been taken',
                    HttpStatus.BAD_REQUEST)
            }
            const exMobile = await this._servicerModel.findOne({ phone: phone })


            if (exMobile) {
                throw new HttpException(
                    'This phone number already taken. please try another.',
                    HttpStatus.BAD_REQUEST)
            }
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);

            const createdUser = new this._servicerModel({
                name: name,
                email: email,
                phone: phone,
                password: hashedPassword,
            });
            return await createdUser.save();


        } catch (error) {
            throw new HttpException(
                error,
                HttpStatus.BAD_REQUEST,
            );

        }
    }
    async login(data: servicer): Promise<servicer> {
        try {

            return await this._servicerModel.findOne({ email: data.email })

        } catch (error) {
            throw new HttpException(
                'There was an error with your login. Please try log again',
                HttpStatus.BAD_REQUEST,
            );
        }

    }
    async ServicerFindId(id: string): Promise<servicer> {
        try {
            return this._servicerModel.findById(id)
        } catch (error) {
            throw new HttpException(
                'there is some issue please try again later',
                HttpStatus.BAD_REQUEST
            )
        }

    }
    async verified(id: string): Promise<servicer> {
        try {
            return await this._servicerModel.findByIdAndUpdate({ _id: id }, { $set: { isVerified: true } })
        } catch (error) {
            throw new HttpException(
                'there is some issue please try again later',
                HttpStatus.BAD_REQUEST
            )
        }

    }
    async addService(data: any, servicerId: string): Promise<service> {
        try {
            console.log(data);

            const { name, price, date, time, location, service_Details } = data

            function convertTo24HourFormat(time12Hour) {
                const date = new Date(`January 1, 2022 ${time12Hour}`);
                const options: any = { hour: "numeric", minute: "numeric", hour12: false };
                return new Intl.DateTimeFormat("en-US", options).format(date);
            }
            let dateFromat = new Date(date)
            console.log(dateFromat);
            const currentTime = time

            // Convert the time to a Date object
            const dateGet = new Date(`January 1, 2022 ${currentTime}`);

            // Function to format time as "hh:mm am/pm"
            function formatTime(time) {
                const options: any = { hour: "numeric", minute: "numeric", hour12: true };
                return new Intl.DateTimeFormat("en-US", options).format(time);
            }
            // Calculate the previous hour
            const previousHour = new Date(dateGet.getTime() - 60 * 60 * 1000);
            const formattedPreviousHour = formatTime(previousHour);

            // Calculate the next hour
            const nextHour = new Date(dateGet.getTime() + 60 * 60 * 1000);
            const formattedNextHour = formatTime(nextHour);



            let PtimeFormat = convertTo24HourFormat(formattedPreviousHour)
            let NtimeFormat = convertTo24HourFormat(formattedNextHour)
            let FtimeFormat = convertTo24HourFormat(time)

            console.log("Current Time:", FtimeFormat);
            console.log("Previous Hour:", PtimeFormat);
            console.log("Next Hour:", NtimeFormat);

            const exData = await this._serviceModel.aggregate([
                {
                    $match: {
                        $and: [

                            { date: dateFromat },
                            { time: { $gte: PtimeFormat } },
                            { time: { $lte: NtimeFormat } }
                        ]

                    }
                }
            ])
            console.log(exData);

            if (exData.length !== 0) {
                throw new HttpException(
                    'the date and time already exist or you can only added service after 1 hour gap',
                    HttpStatus.BAD_REQUEST,
                )
            }
            dateFromat.setUTCHours(0);
            dateFromat.setUTCMinutes(0);
            dateFromat.setUTCSeconds(0);
            dateFromat.setUTCMilliseconds(0);

            // Convert the modified Date object back to a string
            dateFromat.setDate(dateFromat.getDate() + 1)

            const result = new this._serviceModel({
                name: name,
                price: price,
                date: dateFromat,
                time: FtimeFormat,
                location: location,
                service_Details: service_Details,
                owner: servicerId
            })
            return await result.save()
        } catch (error) {
            console.log(error);

            throw new HttpException(
                error,
                HttpStatus.BAD_REQUEST,
            )
        }


    }
    async GetService(): Promise<service[]> {
        try {

            return await this._serviceModel.find().populate('owner')
        } catch (error) {
            throw new HttpException(
                'there is some issue please try again later',
                HttpStatus.BAD_REQUEST
            )
        }
    }
    async GetAllServiceUser(): Promise<service[]> {
        try {
            let today = new Date()
            today.setUTCHours(0);
            today.setUTCMinutes(0);
            today.setUTCSeconds(0);
            today.setUTCMilliseconds(0);


            const result = await this._serviceModel.aggregate([
                {
                    $lookup: {
                        from: 'servicers',
                        foreignField: '_id',
                        localField: 'owner',
                        as: 'owner'
                    }
                },
                {
                    $addFields: {
                        ownerData: {
                            $first: '$owner'
                        }
                    }
                },
                {
                    $match: {
                        'owner.isBlocked': false,
                        isBooked: false,
                        date: { $gte: today }

                    }
                }

            ]);

            console.log(result, 'resssss');

            return result
        } catch (error) {
            throw new HttpException(
                'there is some issue please try again later',
                HttpStatus.BAD_REQUEST
            )
        }

    }
    async blockService(id: string, isBlocked: boolean): Promise<service> {
        try {

            return await this._serviceModel.findByIdAndUpdate({ _id: id }, { $set: { isBlocked: !isBlocked } })
        } catch (error) {
            throw new HttpException(
                'there is some issue please try again later',
                HttpStatus.BAD_REQUEST
            )
        }
    }

    async getServiceById(id: string): Promise<service> {
        try {

            return await this._serviceModel.findById({ _id: id })
        } catch (error) {
            throw new HttpException(
                'there is some issue please try again later',
                HttpStatus.BAD_REQUEST
            )
        }
    }

    async editService(id: string, data: any): Promise<service> {
        try {

            const { name, price, date, time, location, service_Details } = data
            function convertTo24HourFormat(time12Hour) {
                const date = new Date(`January 1, 2022 ${time12Hour}`);
                const options: any = { hour: "numeric", minute: "numeric", hour12: false };
                return new Intl.DateTimeFormat("en-US", options).format(date);
            }
            function formatTime(time) {
                const options: any = { hour: "numeric", minute: "numeric", hour12: true };
                return new Intl.DateTimeFormat("en-US", options).format(time);
            }
            let dateFromat = new Date(date)
            console.log(dateFromat);
            const currentTime = time

            // Convert the time to a Date object
            const dateGet = new Date(`January 1, 2022 ${currentTime}`);



            // Calculate the previous hour
            const previousHour = new Date(dateGet.getTime() - 60 * 60 * 1000);
            const formattedPreviousHour = formatTime(previousHour);

            // Calculate the next hour
            const nextHour = new Date(dateGet.getTime() + 60 * 60 * 1000);
            const formattedNextHour = formatTime(nextHour);
            let PtimeFormat = convertTo24HourFormat(formattedPreviousHour)
            let NtimeFormat = convertTo24HourFormat(formattedNextHour)
            let FtimeFormat = convertTo24HourFormat(time)

            console.log("Current Time:", FtimeFormat);
            console.log("Previous Hour:", PtimeFormat);
            console.log("Next Hour:", NtimeFormat);


            const exData = await this._serviceModel.aggregate([
                {
                    $match: {
                        $and: [
                            { _id: { $ne: id } },
                            { date: dateFromat },
                            { time: { $gte: PtimeFormat } },
                            { time: { $lte: NtimeFormat } }
                        ]

                    }
                }
            ])
            console.log(exData);

            if (exData.length !== 0) {
                throw new HttpException(
                    'the date and time already exist or you can only added service after 1 hour gap',
                    HttpStatus.BAD_REQUEST,
                )
            } dateFromat.setUTCHours(0);
            dateFromat.setUTCMinutes(0);
            dateFromat.setUTCSeconds(0);
            dateFromat.setUTCMilliseconds(0);
            dateFromat.setDate(dateFromat.getDate() + 1)
            return await this._serviceModel.findByIdAndUpdate({ _id: id }, { $set: { name: name, price: price, date: dateFromat, time: FtimeFormat, location: location, service_Details: service_Details } })
        } catch (error) {
            throw new HttpException(
                error,
                HttpStatus.BAD_REQUEST
            )
        }
    }

    async addServiceOrder(data: any, user: string): Promise<serviceOrder> {

        try {

            const { date, time, owner, razorId, paymentMethod, productID, totalAmount } = data

            let dataa = await this._serviceModel.findByIdAndUpdate({ _id: productID }, { $set: { isBooked: true } })
            console.log(dataa, 'update');
            if (paymentMethod === 'wallet') {
                await this._userModel.findByIdAndUpdate({ _id: user }, {
                    $inc: { wallet: -totalAmount }, $push: {
                        walletHistory: {
                            date: new Date(),
                            amount: -totalAmount,
                            description: ` wallet payment - Order ${productID}`,
                        },
                    },
                })
            }

            const orderData = new this._serviceOrderModel({
                user: user,
                service: productID,
                date: date,
                time: time,
                totalAmount: totalAmount,
                owner: owner,
                paymentMethod: paymentMethod
            })

            return await orderData.save()
        } catch (error) {
            throw new HttpException(
                'there is some issue please try again later',
                HttpStatus.BAD_REQUEST
            )
        }
    }

    async getUserserviceHistory(id: string): Promise<serviceOrder[]> {
        try {

            let a = await this._serviceOrderModel.find({ user: id }).populate('owner').populate('service').populate('user')
            console.log(a)
            return a
        } catch (error) {
            throw new HttpException(
                'there is some issue please try again later',
                HttpStatus.BAD_REQUEST
            )
        }

    }

    async serviceOrderCancel(data: any): Promise<serviceOrder> {
        try {


            const { itemId, userId, price } = data
            await this._userModel.findByIdAndUpdate({ _id: userId }, {
                $inc: { wallet: price }, $push: {
                    walletHistory: {
                        date: new Date(),
                        amount: price,
                        description: `Refunded for service cancelled-serviceId : ${itemId}`,
                    }
                },
            })
            return await this._serviceOrderModel.findOneAndUpdate({ _id: itemId }, { $set: { status: 'cancelled' } })
        } catch (error) {
            throw new HttpException(
                'there is some issue please try again later',
                HttpStatus.BAD_REQUEST
            )
        }

    }

    async serviceBlock(data: any): Promise<servicer> {
        try {

            const { id, bool } = data
            return await this._servicerModel.findByIdAndUpdate({ _id: id }, { $set: { isBlocked: bool } })
        } catch (error) {
            throw new HttpException(
                'there is some issue please try again later',
                HttpStatus.BAD_REQUEST
            )
        }
    }
    async servicer(): Promise<servicer[]> {
        try {

            return await this._servicerModel.find()
        } catch (error) {
            throw new HttpException(
                'there is some issue please try again later',
                HttpStatus.BAD_REQUEST
            )
        }
    }
    async findConnection(servicerId: string): Promise<any> {
        try {


            return await this._chatModel
                .findOne({
                    users: { $in: [servicerId] },
                })
                .populate('messages.sender')
                .populate('messages.receiver');
        } catch (error) {
            throw new HttpException(
                'there is some issue please try again later',
                HttpStatus.BAD_REQUEST
            )
        }
    }
    async recentChats(servicerId: string, id: string): Promise<any> {
        try {

            return await this._chatModel
                .findOne({
                    users: { $all: [servicerId, id] },
                })
                .populate('messages.sender')
                .populate('messages.receiver');
        } catch (error) {
            throw new HttpException(
                'there is some issue please try again later',
                HttpStatus.BAD_REQUEST
            )
        }
    }
    createRoom(servicerId: string, id: string): Promise<any> {
        try {

            const newRoom = new this._chatModel({
                users: [servicerId, id],
            });
            return newRoom.save();
        } catch (error) {

        }
    }
    async servicerFindId(id: string): Promise<servicer> {
        try {

            return await this._servicerModel.findById({ _id: id });
        } catch (error) {
            throw new HttpException(
                'there is some issue please try again later',
                HttpStatus.BAD_REQUEST
            )
        }
    }
    async getService(id: string) {
        try {
            return await this._serviceModel.findById({ _id: id })

        } catch (error) {
            throw new HttpException(
                'there is some issue please try again later',
                HttpStatus.BAD_REQUEST
            )
        }
    }
    async updateName(servicerId: string, name: string) {
        try {



            let resName = name['name']
            console.log(resName);

            return this._servicerModel.findByIdAndUpdate({ _id: servicerId }, { $set: { name: resName } })
        } catch (error) {
            throw new HttpException(
                'there is some issue please try again later',
                HttpStatus.BAD_REQUEST
            )
        }
    }
    async ServicerData(id: string) {
        try {

            return this._servicerModel.findById({ _id: id })
        } catch (error) {
            throw new HttpException(
                'there is some issue please try again later',
                HttpStatus.BAD_REQUEST
            )
        }
    }
    async serviceFilter(time: string, date: any, location: string) {
        try {


            function convertTo24HourFormat(time12Hour) {
                const date = new Date(`January 1, 2022 ${time12Hour}`);
                const options: any = { hour: "numeric", minute: "numeric", hour12: false };
                return new Intl.DateTimeFormat("en-US", options).format(date);
            }
              let today = new Date()
            today.setUTCHours(0);
            today.setUTCMinutes(0);
            today.setUTCSeconds(0);
            today.setUTCMilliseconds(0);
            let obj = {}
            obj={isBooked:false}
            if (time !== '') {
                let resTime = convertTo24HourFormat(time)
                obj['time'] = resTime
            }
            if (date !== '') {

                let resDate = new Date(date)

                obj['date'] = resDate
            }
            if (location !== '') {
                obj['location'] = location
            }

            console.log(obj, 'obj');
            if(date==''){
                console.log(today);
                
                obj['date']={$gte: today}
                console.log(obj);
                
               return await this._serviceModel.find(obj).populate('owner')
            }else{
                return await this._serviceModel.find(obj).populate('owner')
            }
           

          

        } catch (error) {
            throw new HttpException(
                'there is some issue please try again later',
                HttpStatus.BAD_REQUEST
            )
        }
    }
    async dashboard(id: string) {
        try {


            const today = new Date()
            console.log(today);

            const revenue = await this._serviceOrderModel.aggregate([
                {
                    $match: {
                        date: { $lte: today },
                        status: 'pending'
                    }
                },
                {
                    $group: {
                        _id: null,
                        revenue: {
                            $sum: "$totalAmount"
                        }
                    }
                }
            ])
            const service = await this._serviceModel.find({ owner: id }).countDocuments()
            const done = await this._serviceModel.find({ owner: id, isBooked: true }).countDocuments()
            const pending = await this._serviceModel.find({ owner: id, isBooked: false }).countDocuments()
            const locationorder = await this._serviceModel.aggregate([
                {
                    $match: {
                        isBooked: true
                    }
                }, {
                    $group: {
                        _id: "$location",
                        count: {
                            $sum: 1
                        }
                    }
                }

            ])

            console.log(revenue, service, done, pending, locationorder);

            return { revenue, service, done, pending, locationorder }
        } catch (error) {
            throw new HttpException(
                'there is some issue please try again later',
                HttpStatus.BAD_REQUEST
            )
        }
    }


}

// make some update on new branch 