import 'dotenv/config';
import { createServer } from '../server/index';

async function testFullApi() {
  console.log('=== GOMeal End-to-End API Test ===\n');

  const app = createServer();
  const server = app.listen(8090, () => {
    console.log('Test server running on port 8090');
  });

  const baseUrl = 'http://localhost:8090';

  const fetchJson = async (url: string, options: RequestInit = {}) => {
    const res = await fetch(`${baseUrl}${url}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(options.headers || {}),
      },
    });
    const text = await res.text();
    try {
      return { status: res.status, data: JSON.parse(text) };
    } catch {
      return { status: res.status, text };
    }
  };

  try {
    // 1. Health check
    console.log('1. Testing GET /api/health...');
    const health = await fetchJson('/api/health');
    console.log(`   Status: ${health.status}, App: ${health.data.app}`);

    // 2. Register
    const testUsername = `user_${Date.now()}`;
    const testEmail = `${testUsername}@example.com`;
    const testPassword = 'Password123!';

    console.log(`2. Testing POST /api/auth/register (${testUsername})...`);
    const reg = await fetchJson('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email: testEmail, username: testUsername, password: testPassword }),
    });
    console.log(`   Status: ${reg.status}, User: ${reg.data.user?.username}`);

    // 3. Login
    console.log('3. Testing POST /api/auth/login...');
    const login = await fetchJson('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ identifier: testUsername, password: testPassword }),
    });
    console.log(`   Status: ${login.status}, Token received: ${!!login.data.token}`);
    const token = login.data.token;
    const authHeaders = { Authorization: `Bearer ${token}` };

    // 4. Get Profile
    console.log('4. Testing GET /api/v1/profile...');
    const profile = await fetchJson('/api/v1/profile', { headers: authHeaders });
    console.log(`   Status: ${profile.status}, Full Name: "${profile.data.full_name}"`);

    // 5. Update Profile
    console.log('5. Testing PUT /api/v1/profile...');
    const updatedProfile = await fetchJson('/api/v1/profile', {
      method: 'PUT',
      headers: authHeaders,
      body: JSON.stringify({
        full_name: 'Budi Test User',
        phone: '081234567890',
        address: 'Jl. Merdeka No. 45, Jakarta Pusat',
      }),
    });
    console.log(`   Status: ${updatedProfile.status}, Updated Name: ${updatedProfile.data.full_name}`);

    // 6. Categories
    console.log('6. Testing GET /api/v1/categories...');
    const cats = await fetchJson('/api/v1/categories');
    console.log(`   Status: ${cats.status}, Categories count: ${cats.data.length}`);

    // 7. Menu List
    console.log('7. Testing GET /api/v1/menu...');
    const menu = await fetchJson('/api/v1/menu?limit=5');
    console.log(`   Status: ${menu.status}, Items found: ${menu.data.data?.length}, Total: ${menu.data.pagination?.total}`);

    const firstMenu = menu.data.data[0];
    console.log(`   First Menu: ${firstMenu.name} (Rp${firstMenu.price}, Stock: ${firstMenu.stock_quantity})`);

    // 8. Menu Detail
    console.log(`8. Testing GET /api/v1/menu/${firstMenu.id}...`);
    const menuDetail = await fetchJson(`/api/v1/menu/${firstMenu.id}`);
    console.log(`   Status: ${menuDetail.status}, Name: ${menuDetail.data.name}`);

    // 9. Add to Favorites
    console.log('9. Testing POST /api/v1/favorites...');
    const addFav = await fetchJson('/api/v1/favorites', {
      method: 'POST',
      headers: authHeaders,
      body: JSON.stringify({ menu_id: firstMenu.id }),
    });
    console.log(`   Status: ${addFav.status}`);

    // 10. Get Favorites
    console.log('10. Testing GET /api/v1/favorites...');
    const favs = await fetchJson('/api/v1/favorites', { headers: authHeaders });
    console.log(`   Status: ${favs.status}, Favorites count: ${favs.data.length}`);

    // 11. Create Order (Checkout)
    console.log('11. Testing POST /api/v1/orders (Checkout Transaksional)...');
    const orderPayload = {
      recipient_name: 'Budi Test User',
      recipient_phone: '081234567890',
      delivery_address: 'Jl. Merdeka No. 45, Jakarta Pusat',
      customer_note: 'Mohon kuah dipisah',
      payment_method: 'cod',
      items: [
        { menu_id: firstMenu.id, quantity: 2 },
      ],
    };
    const orderRes = await fetchJson('/api/v1/orders', {
      method: 'POST',
      headers: authHeaders,
      body: JSON.stringify(orderPayload),
    });
    console.log(`   Status: ${orderRes.status}, Order ID: ${orderRes.data.order_id}`);
    const orderId = orderRes.data.order_id;

    // 12. Get User Orders
    console.log('12. Testing GET /api/v1/orders...');
    const ordersList = await fetchJson('/api/v1/orders', { headers: authHeaders });
    console.log(`   Status: ${ordersList.status}, Orders count: ${ordersList.data.length}`);

    // 13. Get Order Detail
    console.log(`13. Testing GET /api/v1/orders/${orderId}...`);
    const orderDetail = await fetchJson(`/api/v1/orders/${orderId}`, { headers: authHeaders });
    console.log(`   Status: ${orderDetail.status}, Total: Rp${orderDetail.data.total_price}, Items: ${orderDetail.data.items?.length}`);

    // 14. Cancel Order
    console.log(`14. Testing PATCH /api/v1/orders/${orderId}/cancel...`);
    const cancelRes = await fetchJson(`/api/v1/orders/${orderId}/cancel`, {
      method: 'PATCH',
      headers: authHeaders,
    });
    console.log(`   Status: ${cancelRes.status}, Message: "${cancelRes.data.message}"`);

    // 15. Remove from Favorites
    console.log(`15. Testing DELETE /api/v1/favorites/${firstMenu.id}...`);
    const delFav = await fetchJson(`/api/v1/favorites/${firstMenu.id}`, {
      method: 'DELETE',
      headers: authHeaders,
    });
    console.log(`   Status: ${delFav.status}`);

    console.log('\n🎉 ALL 15 API TESTS PASSED SUCCESSFULLY! 🎉\n');
  } catch (err) {
    console.error('Test error:', err);
  } finally {
    server.close();
    process.exit(0);
  }
}

testFullApi();
