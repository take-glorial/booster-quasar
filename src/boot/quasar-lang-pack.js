import { Quasar } from "quasar";

export default async () => {
  const langIso = "ko-kr";

  try {
    await import("quasar/lang/" + langIso).then(lang =>
      Quasar.lang.set(lang.default)
    );
  } catch (err) {}
};
