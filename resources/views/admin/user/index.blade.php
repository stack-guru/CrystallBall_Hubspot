@extends('layouts.admin')
@section('page-title', 'Users')

@section('css')
  <link rel="stylesheet" type="text/css" href="https://cdn.datatables.net/1.11.5/css/jquery.dataTables.min.css" />
@endsection

@section('content')
  <div class="container-fluid">
    <div class="row justify-content-center">
      <div class="col-md-12">
        <div class="card">
          <div class="card-header">
            <span class="badge badge-warning float-right">Total Users: <span id="recordsTotal">Loading...</span></span>
          </div>
          <div class="card-body">
            <table class="table table-striped table-hover" id="users-datatable">
              <thead>
                <tr>
                  <th>Team</th>
                  <th>Email</th>
                  <th>Name</th>
                  <th>Plan (Ending)</th>
                  <th>Registration Date</th>
                  <th>Tags</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody></tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>
@endsection

@section('js')
  <script src="https://cdnjs.cloudflare.com/ajax/libs/datatables/1.10.21/js/jquery.dataTables.min.js"
    integrity="sha512-BkpSL20WETFylMrcirBahHfSnY++H2O1W+UnEEO4yNIl+jI2+zowyoGJpbtk6bx97fBXf++WJHSSK2MV4ghPcg=="
    crossorigin="anonymous" referrerpolicy="no-referrer"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/datatables-buttons/2.2.3/js/dataTables.buttons.min.js"
    integrity="sha512-QT3oEXamRhx0x+SRDcgisygyWze0UicgNLFM9Dj5QfJuu2TVyw7xRQfmB0g7Z5/TgCdYKNW15QumLBGWoPefYg=="
    crossorigin="anonymous" referrerpolicy="no-referrer"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/datatables-buttons/2.2.3/js/buttons.html5.min.js"
    integrity="sha512-BdN+kHA7QfWIcQE3WMwSj5QAvVUrSGxJLv7/yuEEypMOZBSJ1VKGr9BSpOew+6va9yfGUACw/8Yt7LKNn3RKRA=="
    crossorigin="anonymous" referrerpolicy="no-referrer"></script>
  <script>
    var table = $("#users-datatable").DataTable({
      dom: "<'row'<'col-sm-12 col-md-6'l><'col-sm-12 col-md-6'f>>" +
        "<'row'<'col-sm-12'tr>>" +
        "<'row'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7'p>>",
      processing: true,
      serverSide: true,
      ajax: {
        url: window.location.href,
        data: function(d) {}
      },
      order: [
        [4, 'desc']
      ],
      "columnDefs": [{
        "searchable": false,
        "orderable": false,
        "targets": 6
      }],
      footerCallback: function (row, data, start, end, display) {
        $("#recordsTotal").text(table.page.info().recordsTotal);
      },
      buttons: [{
        extend: 'csv',
        exportOptions: {
          columns: [0, 1, 2, 3, 4, 5]
        },
        className: 'btn btn-primary'
      }],
      columns: [{
          name: "team_name",
          data: "team_name"
        },
        {
          name: "email",
          data: "email"
        },
        {
          name: "name",
          data: "name"
        },
        {
          name: "pricePlan.name",
          data: "price_plan.name"
        },
        {
          name: "created_at",
          data: "created_at"
        },
        {
          name: "verification",
          data: "verification",
          searchable: false
        },
        {
          name: "action",
          data: "action"
        }
      ]
    });
  </script>
@endsection
