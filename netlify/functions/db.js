import { neon } from '@netlify/neon';

const sql = neon(); // ใช้ NETLIFY_DATABASE_URL อัตโนมัติ

export async function handler(event, context) {
  try {
    if (event.httpMethod === "POST") {
      const body = JSON.parse(event.body);

      await sql`
        INSERT INTO expenses (description, amount, category)
        VALUES (${body.description}, ${body.amount}, ${body.category})
      `;

      return {
        statusCode: 200,
        body: JSON.stringify({ message: "Saved" })
      };
    }

    if (event.httpMethod === "GET") {
      const rows = await sql`SELECT * FROM expenses ORDER BY id DESC`;
      return {
        statusCode: 200,
        body: JSON.stringify(rows)
      };
    }

    return { statusCode: 405, body: "Method Not Allowed" };

  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message })
    };
  }
}
