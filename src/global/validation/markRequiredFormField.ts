const markRequiredFormField = (field: HTMLInputElement) => {
  const parent: HTMLElement | null = field.parentElement;

  if (!parent) return;

  const small = parent.querySelector("small");

  if (field.value.trim().length < 1) {
    parent.classList.add("required");
    small?.classList.add("visible");
  } else {
    parent.classList.remove("required");
    small?.classList.remove("visible");
  }
};

export default markRequiredFormField;
