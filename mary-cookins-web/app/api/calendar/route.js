import { NextResponse } from "next/server";

// Mock database for orders to check the 15 orders/week limit
const ordersDb = [];

function getWeekNumber(d) {
  const date = new Date(d.getTime());
  date.setHours(0, 0, 0, 0);
  date.setDate(date.getDate() + 3 - (date.getDay() + 6) % 7);
  const week1 = new Date(date.getFullYear(), 0, 4);
  return 1 + Math.round(((date.getTime() - week1.getTime()) / 86400000 - 3 + (week1.getDay() + 6) % 7) / 7);
}

export async function POST(req) {
  try {
    const data = await req.json();
    const { name, phone, date, items, total } = data;

    if (!name || !phone || !date || !items || items.length === 0) {
      return NextResponse.json({ error: "Dados incompletos" }, { status: 400 });
    }

    const orderDate = new Date(date);
    const orderWeek = getWeekNumber(orderDate);
    const orderYear = orderDate.getFullYear();

    // Check weekly limit (15)
    const ordersThisWeek = ordersDb.filter(
      (o) => o.year === orderYear && o.week === orderWeek
    ).length;

    if (ordersThisWeek >= 15) {
      return NextResponse.json(
        { error: "Limite de 15 pedidos atingido para esta semana. Escolha outra data." },
        { status: 400 }
      );
    }

    // Save order
    const newOrder = {
      id: Date.now(),
      name,
      phone,
      date,
      items,
      total,
      week: orderWeek,
      year: orderYear,
    };
    ordersDb.push(newOrder);

    // TODO: Integração real com googleapis (Google Calendar API) entraria aqui.
    // auth = new google.auth.GoogleAuth({...})
    // calendar = google.calendar({version: 'v3', auth})
    // await calendar.events.insert({ calendarId: 'primary', resource: event })

    return NextResponse.json({ success: true, order: newOrder }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Erro interno no servidor" }, { status: 500 });
  }
}
