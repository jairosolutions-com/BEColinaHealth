import { Injectable } from '@nestjs/common';
import * as otpGenerator from 'otp-generator';

@Injectable()
export class OtpService {

  private readonly otps: Map<string, { otp: string; timestamp: number }> =
    new Map();
  private readonly otpExpirationTime: number = 5 * 60 * 1000; // OTP expiration time in milliseconds (5 minutes)

  generateOTP(length: number = 6): { otp: string; timestamp: number } {
    const otp = otpGenerator.generate(length, {
      digits: true,
      lowerCaseAlphabets: false,
      upperCaseAlphabets: false,
      specialChars: false,
    });
    const timestamp = Date.now(); // Record the timestamp when OTP is generated
    this.otps.set(otp, { otp, timestamp }); // Store the OTP along with its timestamp
    return { otp, timestamp };
  }

  verifyOTP(userOTP: string, generatedOTP: string): boolean {
    const storedOTP = this.otps.get(generatedOTP);
    if (!storedOTP) {
      return false; // OTP not found
    }
    const currentTime = Date.now();
    if (currentTime - storedOTP.timestamp > this.otpExpirationTime) {
      this.otps.delete(generatedOTP); // Remove expired OTPs from the map
      return false; // OTP has expired
    }
    return userOTP === generatedOTP;
  }
}
