<p>{{ $details }}</p>
<table border="1">
    <tbody>
        <tr><th scope="col">Name</th><td>{{ $user->name }}</td><th scope="col">Email</th><td>{{ $user->email }}</td></tr>
        <tr><th scope="col">Price Plan</th><td>{{ $user->pricePlan->name }}</td><th scope="col">Plan Expiry Date</th><td>{{ $user->price_plan_expiry_date }}</td></tr>
        <tr><th scope="col">Last Login At</th><td>{{ $user->last_login_at }}</td><th scope="col">Registered At</th><td>{{ $user->created_at }}</td></tr>
    </tbody>
</table>