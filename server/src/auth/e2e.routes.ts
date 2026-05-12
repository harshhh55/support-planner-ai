import { Router } from "express";
import { setSessionCookie } from "./cookie";

const router = Router();

function checkE2EMode() {
  return process.env.E2E_TEST_MODE === "true";
}

router.all("/e2e/login", (req, res) => {
  if (!checkE2EMode()) {
    return res.status(404).json({ error: "Not found" });
  }

  const email =
    typeof req.body?.email === "string" ? req.body.email : (typeof req.query?.email === "string" ? req.query.email : "e2e@test.local");

  const name = typeof req.body?.name === "string" ? req.body.name : (typeof req.query?.name === "string" ? req.query.name : "E2E user");

  const id = typeof req.body?.id === "string" ? req.body.id : (typeof req.query?.id === "string" ? req.query.id : "e2e_user_1");

  setSessionCookie(res, { id, email, name });

  if (req.method === "GET") {
    return res.redirect("/support");
  }

  return res.json({ ok: true });
});

router.post("/e2e/logout", (req, res) => {
  if (!checkE2EMode()) {
    return res.status(404).json({ error: "Not found" });
  }

  res.clearCookie(process.env.SESSION_COOKIE_NAME!, {
    httpOnly: true,
    secure: false,
    sameSite: "lax",
    path: "/",
  });

  return res.json({ ok: true });
});

export default router;
