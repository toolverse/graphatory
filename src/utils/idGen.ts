export default function genID() {
    const timeStamp = Date.now();
    const str =
        "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890";
    let Id = "";
    for (let i = 0; i < 7; i++) {
        const rom = Math.floor(1 + (str.length - 1) * Math.random());
        Id += str.charAt(rom);
    }
    Id += timeStamp.toString();
    return Id;
}
