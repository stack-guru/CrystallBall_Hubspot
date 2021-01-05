<p>{{ $details }}</p>
<table border="1">
    <tbody>
        <tr><th>Name</th><td>{{ $user->name }}</td><th>Email</th><td>{{ $user->email }}</td></tr>
        <tr><th>Price Plan</th><td>{{ $user->pricePlan->name }}</td><th>Plan Expiry Date</th><td>{{ $user->price_plan_expiry_date }}</td></tr>
        <tr><th>Last Login At</th><td>{{ $user->last_login_at }}</td><th>Registered At</th><td>{{ $user->created_at }}</td></tr>
    </tbody>
</table>