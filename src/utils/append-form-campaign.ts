export const appendOptionalFields = (
  form: FormData,
  data: Record<string, Date | string | number | undefined>,
  file?: File | null
) => {
  if (file) {
    form.append("file", file);
  }

  const keys = ["startAt", "endAt", "startTimeAt", "endTimeAt"] as const;

  for (const key of keys) {
    const value = data[key];
    switch (key) {
      case "startAt":
      case "endAt":
      case "startTimeAt":
      case "endTimeAt":
        if (value) {
          form.append(key, value.toString());
        }
        break;
    }
  }
};
