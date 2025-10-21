const user = "Tom.vaillant.vt";
const domain = "gmail.com";
const phonePart1 = "07 83 95";
const phonePart3 = "79 41";
const mail = user + "@" + domain;
const phone = phonePart1 + " " + phonePart3;

document.querySelectorAll('.mail-link').forEach(link => {
	link.href = "mailto:" + mail;
});
document.querySelectorAll('.mail-text').forEach(span => {
	span.textContent = mail;
});
document.querySelectorAll('.phone-link').forEach(link => {
	link.href = "tel:" + phone.replace(/ /g, "");
});
document.querySelectorAll('.phone-text').forEach(span => {
	span.textContent = phone;
});