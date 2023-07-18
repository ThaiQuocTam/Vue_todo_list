// import { createI18n } from "vue-i18n";
import { createI18n } from "vue-i18n";
import en from "./language/en.json";
import vn from "./language/vn.json";

function loadLocaleMessages() {
	const locales = [{ English: en }, { Vietnamese: vn }];
	const message = {};
	locales.forEach((lang) => {
		const key = Object.keys(lang);
		message[key] = lang[key];
	});

	return message;
}

export default createI18n({
	locale: "English",
	fallbackLocale: "English",
	messages: loadLocaleMessages(),
});
