"use strict"

module.exports = (date) => {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const hours = (date.getHours() < 10) ? "0" + date.getHours().toString() : date.getHours();
  const minutes = (date.getMinutes() < 10) ? "0" + date.getMinutes().toString() : date.getMinutes();
  const seconds = (date.getSeconds() < 10) ? "0" + date.getSeconds().toString() : date.getSeconds();
  return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}+03:00`
}
