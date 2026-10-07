const fs = require('fs');
let c = fs.readFileSync('server/routes/api.ts', 'utf8');

c = c.replace(
  /  \/\/ Auto-create Delhivery shipment for prepaid \(Razorpay\) orders\r?\n  if \(orderData.paymentMethod === 'razorpay' && !orderData.trackingNumber\) \{\r?\n    try \{\r?\n      \/\/ In a real scenario, you'd call Delhivery API here with order details\r?\n      const mockAwb = Math.floor\(1000000000 \+ Math.random\(\) \* 9000000000\).toString\(\);\r?\n      orderData.trackingNumber = mockAwb;\r?\n      orderData.status = 'processing'; \/\/ Automatically advance status since it's paid\r?\n    \} catch \(err\) \{\r?\n      console.error\('Failed to auto-create Delhivery shipment:', err\);\r?\n    \}\r?\n  \}/,
  `  // Auto-create Delhivery shipment for prepaid (Razorpay) orders
  const settings = await getSettings();
  if (orderData.paymentMethod === 'razorpay' && !orderData.trackingNumber) {
    try {
      if (settings.delhivery_api_key) {
        const payload = {
          format: 'json',
          data: {
            shipments: [{
              name: orderData.customerName,
              add: orderData.shippingAddress,
              pin: orderData.pincode,
              city: orderData.city,
              state: '',
              country: 'India',
              phone: orderData.customerPhone,
              order: orderData.id,
              payment_mode: 'Pre-paid',
              products_desc: orderData.items.map((i) => i.name).join(', '),
              total_amount: orderData.total,
              seller_name: 'Footenix Store',
              quantity: orderData.items.reduce((acc, item) => acc + item.quantity, 0)
            }],
            pickup_location: { name: 'Footenix Store', add: 'Main Warehouse', city: 'Delhi', pin: '110001', country: 'India' }
          }
        };

        const res = await fetch('https://track.delhivery.com/api/cmu/create.json', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': 'Token ' + settings.delhivery_api_key
          },
          body: 'format=json&data=' + encodeURIComponent(JSON.stringify(payload.data))
        });
        const result = await res.json();
        if (result.packages && result.packages.length > 0) {
          orderData.trackingNumber = result.packages[0].waybill;
          orderData.status = 'processing';
        } else {
          throw new Error('Delhivery API error: ' + JSON.stringify(result));
        }
      } else {
        const mockAwb = Math.floor(1000000000 + Math.random() * 9000000000).toString();
        orderData.trackingNumber = mockAwb;
        orderData.status = 'processing';
      }
    } catch (err) {
      console.error('Failed to create Delhivery shipment:', err);
    }
  }`
);

c = c.replace(
  /  \/\/ Send Automated Email via Nodemailer \(Gmail\)\r?\n  const settings = await getSettings\(\);\r?\n  if \(settings.gmail_user && settings.gmail_app_password\) \{/,
  `  // Send Automated Email via Nodemailer (Gmail)\n  if (settings.gmail_user && settings.gmail_app_password) {`
);

fs.writeFileSync('server/routes/api.ts', c);
