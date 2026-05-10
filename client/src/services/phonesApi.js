const baseUrl = "https://shop-tracker-rho.vercel.app";
 


async function parseJson(res) {
  const text = await res.text();
  try {
    return text ? JSON.parse(text) : {};
  } catch {
    return { success: false, message: text || "Invalid response" };
  }
}

export async function fetchPhonesMeta() {
  const res = await fetch(`${baseUrl}/api/phones/meta`);
  const data = await parseJson(res);
  if (!res.ok || data.success === false) {
    throw new Error(data.message || "Could not load catalog meta");
  }
  return data;
}

export async function fetchPhones({
  companyName = "all",
  search = "",
  page = 1,
  limit = 9,
}) {
  const q = new URLSearchParams();
  if (companyName && companyName !== "all") q.set("companyName", companyName);
  if (search) q.set("search", search);
  q.set("page", String(page));
  q.set("limit", String(limit));

  const res = await fetch(`${baseUrl}/api/phones?${q.toString()}`);
  const data = await parseJson(res);
  if (!res.ok || data.success === false) {
    throw new Error(data.message || "Could not load phones");
  }
  return data;
}

export async function createPhone(body) {
  const res = await fetch(`${baseUrl}/api/phones/add-phone`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const data = await parseJson(res);
  if (!res.ok || data.success === false) {
    const err = new Error(data.message || "Could not add phone");
    err.status = res.status;
    err.payload = data;
    throw err;
  }
  return data;
}

export async function deletePhone(id) {
  const res = await fetch(`${baseUrl}/api/phones/${encodeURIComponent(id)}`, {
    method: "DELETE",
  });
  const data = await parseJson(res);
  if (!res.ok || data.success === false) {
    throw new Error(data.message || "Could not delete phone");
  }
  return data;
}

export async function updateQuantity(id, quantity) {
  const res = await fetch(
    `${baseUrl}/api/phones/${encodeURIComponent(id)}/quantity`,
    {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ quantity }),
    }
  );
  const data = await parseJson(res);
  if (!res.ok || data.success === false) {
    throw new Error(data.message || "Could not update quantity");
  }
  return data;
}
