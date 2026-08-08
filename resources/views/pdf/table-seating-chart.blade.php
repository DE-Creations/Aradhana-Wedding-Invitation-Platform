<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<title>Seating Chart</title>
<style>
    @page { margin: 24px 28px; }
    * { box-sizing: border-box; }
    body {
        font-family: 'Helvetica', 'Arial', sans-serif;
        color: #1a1a1a;
        font-size: 12px;
    }
    .header {
        text-align: center;
        border-bottom: 2px solid #C9A96E;
        padding-bottom: 10px;
        margin-bottom: 6px;
    }
    .header h1 {
        margin: 0;
        font-size: 20px;
        letter-spacing: 1px;
        color: #7a5c1e;
    }
    .header p {
        margin: 3px 0 0;
        font-size: 11px;
        color: #666;
    }
    .summary {
        text-align: center;
        font-size: 10.5px;
        color: #666;
        margin-bottom: 16px;
    }
    .layout {
        width: 100%;
        border-collapse: collapse;
    }
    .layout td {
        width: 50%;
        vertical-align: top;
        padding: 0 8px 16px 0;
    }
    .layout td.right {
        padding: 0 0 16px 8px;
    }
    .table-card {
        border: 2px solid #2b2b2b;
        page-break-inside: avoid;
    }
    .table-card-title {
        text-align: center;
        font-size: 16px;
        font-weight: bold;
        padding: 8px 6px;
        border-bottom: 2px solid #2b2b2b;
    }
    .table-card-meta {
        text-align: center;
        font-size: 9.5px;
        color: #888;
        padding: 3px 6px 6px;
        border-bottom: 2px solid #2b2b2b;
    }
    table.guest-list {
        width: 100%;
        border-collapse: collapse;
    }
    table.guest-list th {
        text-align: center;
        font-size: 11px;
        font-weight: bold;
        padding: 6px 4px;
        border-bottom: 2px solid #2b2b2b;
        border-right: 1px solid #2b2b2b;
    }
    table.guest-list th:last-child,
    table.guest-list td:last-child {
        border-right: none;
    }
    table.guest-list td {
        text-align: center;
        padding: 7px 4px;
        font-size: 11px;
        border-bottom: 1px solid #ccc;
        border-right: 1px solid #2b2b2b;
    }
    table.guest-list td.guest-name {
        text-align: left;
        padding-left: 8px;
    }
    .empty-table {
        padding: 12px 8px;
        font-size: 10.5px;
        color: #aaa;
        font-style: italic;
        text-align: center;
    }
    .footer {
        margin-top: 10px;
        text-align: center;
        font-size: 9px;
        color: #bbb;
    }
</style>
</head>
<body>
    <div class="header">
        <h1>{{ $wedding->groom_name }} &amp; {{ $wedding->bride_name }}</h1>
        <p>Seating Chart</p>
    </div>

    <div class="summary">
        {{ count($tables) }} {{ count($tables) === 1 ? 'table' : 'tables' }}
        &middot;
        {{ $tables->sum('seat_count') }} seats
        &middot;
        {{ $tables->sum('assigned_count') }} guests assigned
    </div>

    @if (count($tables) > 0)
        <table class="layout">
            @foreach ($tables->chunk(2) as $pair)
                <tr>
                    @foreach ($pair as $i => $table)
                        <td class="{{ $i === 1 ? 'right' : '' }}">
                            <div class="table-card">
                                <div class="table-card-title">{{ $table['table_name'] }}</div>
                                <div class="table-card-meta">{{ $table['assigned_count'] }} / {{ $table['seat_count'] }} seats</div>

                                @if (count($table['guests']) > 0)
                                    <table class="guest-list">
                                        <thead>
                                            <tr>
                                                <th style="text-align:left; padding-left:8px;">Guest</th>
                                                <th>Pax</th>
                                                <th>RSVP</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            @foreach ($table['guests'] as $guest)
                                                <tr>
                                                    <td class="guest-name">{{ $guest['guest_name'] }}</td>
                                                    <td>{{ str_pad($guest['assigned_count'], 2, '0', STR_PAD_LEFT) }}</td>
                                                    <td>{{ $guest['rsvp_status'] ?? 'Pending' }}</td>
                                                </tr>
                                            @endforeach
                                        </tbody>
                                    </table>
                                @else
                                    <div class="empty-table">No guests assigned yet.</div>
                                @endif
                            </div>
                        </td>
                    @endforeach
                    @if (count($pair) === 1)
                        <td class="right"></td>
                    @endif
                </tr>
            @endforeach
        </table>
    @else
        <p style="text-align: center; color: #999;">No tables have been created yet.</p>
    @endif

    <div class="footer">
        Generated by Aradhana &middot; {{ now()->format('F j, Y') }}
    </div>
</body>
</html>
