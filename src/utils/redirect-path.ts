export const redirectPath = (typerUser: string) => {
  let redirectPath;

  switch (typerUser) {
    case "estudante":
        redirectPath = "/app/student";
      break;
    case "empresa":
        redirectPath = "/app/company";
      break;

    case "universidade":
        redirectPath = "/app/university";
      break;
    default:
      redirectPath = "/";
  }

  return redirectPath
}