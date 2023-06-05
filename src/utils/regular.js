/*
 * @Author: your name
 * @Date: 2020-12-03 15:04:06
 * @LastEditTime: 2021-08-23 15:14:14
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /error-sytem/client/src/utils/regular.js
 */
const checkPhone = (phone) => /^1{1}[3456789]{1}\d{9}$/.test(phone);
const checkUser = (name) => /^[a-z A-Z]+\w{5,}/.test(name);
//最少8个字符,包含数字和字母 最长为16个字符 ^(?=.*\d)(?=.*[a-zA-Z])[0-9a-zA-Z]{8,16}$
//最少8个字符,包含数字和字母特殊字符 最长为32个字符 (?=^.{8,32}$)(?=(?:.*?\d){1})(?=.*[a-z])(?=(?:.*?[!@#$%*()_+^&}{:;?.]){1})(?!.*\s)[0-9a-zA-Z!@#$%*()_+^&]*$
const checkPassword = (name) =>
  /^(?=.*\d)(?=.*[a-zA-Z])[0-9a-zA-Z]{8,16}$/.test(name);
const checkVerificationCode = (code) => /^([a-z A-Z]|\d){5}$/.test(code);
export {checkPhone, checkUser, checkPassword, checkVerificationCode};
