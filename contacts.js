const fs = require('fs');
const chalk = require('chalk')
const validator = require('validator')
const { resolve } = require('path');
const { rejects } = require('assert');

// membuat folder data jika blm ada
const dirPath = './data';
if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath);
}

// membuat file contacts.json jika blm ada
const dataPath = './data/contacts.json';
if (!fs.existsSync(dataPath)) {
    fs.writeFileSync(dataPath, '[]', 'utf8');
}

const loadContact = () => {
    const file = fs.readFileSync('data/contacts.json', 'utf8');
    const contacts = JSON.parse(file);
    return contacts
}

const simpanContact = (nama, email, noHp) => {
    const contact = { nama, email, noHp };
    // const file = fs.readFileSync('data/contacts.json', 'utf8');
    // const contacts = JSON.parse(file);
    const contacts = loadContact()

    // cek duplikat data
    const duplikat = contacts.find((contact) => contact.nama === nama)
    if (duplikat) {
        console.log(
            chalk.red.inverse.bold('Contact sudah terdaftar, gunakan nama lain!')
        )
        return false
    }

    // cek validasi email
    if (email) {
        if (!validator.isEmail(email)) {
            console.log(
                chalk.red.inverse.bold('Email tidak valid!')
            )
            return false
        }
    }

    // cek validasi nomor
    if (!validator.isMobilePhone(noHp, 'id-ID')) {
        console.log(
            chalk.red.inverse.bold('Nomor HP tidak valid!')
        )
        return false
    }

    contacts.push(contact);

    fs.writeFileSync('data/contacts.json', JSON.stringify(contacts));

    console.log(
        chalk.green.inverse.bold('Terimakasih sudah memasukkan data')
    )
}

// menampilkan kontak dgn perintah noda app list
const listContact = () => {
    const contacts = loadContact()
    console.log(
        chalk.cyan.inverse.bold('Daftar Kontak : ')
    )
    contacts.forEach((contact, i) => {
        console.log(`${i + 1}. ${contact.nama} - ${contact.noHp}`)

    });
}

// menampilkan detail contact berdasarkan nama
const detailContact = (nama) => {
    const contacts = loadContact()

    const contact = contacts.find((contact) => contact.nama.toLowerCase() === nama.toLowerCase())

    if (!contact) {
        console.log(
            chalk.red.inverse.bold(`${nama} tidak ditemukan!`)
        )
        return false
    }
    console.log(chalk.cyan.inverse.bold((contact.nama)))
    console.log(contact.noHp)
    if (contact.email) {
        console.log(contact.email)
    }
}

// menghapus contact berdasarkan nama
const deleteContact = (nama) => {
    const contacts = loadContact()
    const newContacts = contacts.filter(
        (contact) => contact.nama.toLowerCase() !== nama.toLowerCase()
    )

    if (contacts.length === newContacts.length) {
        console.log(chalk.red.inverse.bold(`${nama} tidak ditemukan!`))
        return false
    }

    fs.writeFileSync('data/contacts.json', JSON.stringify(newContacts));

    console.log(
        chalk.green.inverse.bold(`Data contact ${nama} berhasil dihapus!`))

}

module.exports = { simpanContact, listContact, detailContact, deleteContact }