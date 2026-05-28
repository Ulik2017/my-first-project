<?php
header('Content-Type: application/json');
require_once __DIR__ . '/db.php';

$method = $_SERVER['REQUEST_METHOD'];
$action = $_GET['action'] ?? '';
$input = json_decode(file_get_contents('php://input'), true) ?? [];

function out($data, $code=200){ http_response_code($code); echo json_encode($data); exit; }

try {
  $pdo = db();

  if ($action === 'bootstrap') {
    out([
      'sales' => $pdo->query('SELECT id,name,email,phone,category,username,password FROM sales ORDER BY id DESC')->fetchAll(),
      'customers' => $pdo->query('SELECT * FROM customers ORDER BY id DESC')->fetchAll(),
      'quotations' => $pdo->query('SELECT * FROM quotations ORDER BY id DESC')->fetchAll(),
    ]);
  }

  if ($action === 'login' && $method === 'POST') {
    $st = $pdo->prepare('SELECT * FROM users WHERE username=? AND password=?');
    $st->execute([$input['username'] ?? '', $input['password'] ?? '']);
    $u = $st->fetch();
    if (!$u) out(['error' => 'Login gagal'], 401);
    out(['user' => $u]);
  }

  if ($action === 'save-sales' && $method === 'POST') {
    if (!empty($input['id'])) {
      $st = $pdo->prepare('UPDATE sales SET name=?, email=?, phone=?, category=?, username=?, password=? WHERE id=?');
      $st->execute([$input['name'],$input['email'],$input['phone'],$input['category'],$input['username'],$input['password'],$input['id']]);
    } else {
      $st = $pdo->prepare('INSERT INTO sales(name,email,phone,category,username,password) VALUES(?,?,?,?,?,?)');
      $st->execute([$input['name'],$input['email'],$input['phone'],$input['category'],$input['username'],$input['password']]);
      $input['id'] = $pdo->lastInsertId();
    }
    $oldUser = null;
    if (!empty($input['id'])) {
      $oldSt = $pdo->prepare('SELECT username FROM users WHERE sales_id=? LIMIT 1');
      $oldSt->execute([$input['id']]);
      $oldUser = $oldSt->fetchColumn();
    }
    if ($oldUser && $oldUser !== $input['username']) {
      $up = $pdo->prepare('UPDATE users SET username=?, password=?, role=? WHERE sales_id=?');
      $up->execute([$input['username'],$input['password'],$input['category'],$input['id']]);
    } else {
      $st = $pdo->prepare('INSERT INTO users(username,password,role,sales_id) VALUES(?,?,?,?) ON DUPLICATE KEY UPDATE password=VALUES(password), role=VALUES(role), sales_id=VALUES(sales_id)');
      $st->execute([$input['username'],$input['password'],$input['category'],$input['id']]);
    }
    out(['ok'=>true]);
  }

  if ($action === 'save-customer' && $method === 'POST') {
    if (!empty($input['id'])) {
      $st = $pdo->prepare('UPDATE customers SET name=?, pic=?, country=?, state=?, email=?, phone=?, website=? WHERE id=?');
      $st->execute([$input['name'],$input['pic'],$input['country'],$input['state'],$input['email'],$input['phone'],$input['website'],$input['id']]);
    } else {
      $st = $pdo->prepare('INSERT INTO customers(name,pic,country,state,email,phone,website) VALUES(?,?,?,?,?,?,?)');
      $st->execute([$input['name'],$input['pic'],$input['country'],$input['state'],$input['email'],$input['phone'],$input['website']]);
    }
    out(['ok'=>true]);
  }

  if ($action === 'save-quotation' && $method === 'POST') {
    if (!empty($input['id'])) {
      $st = $pdo->prepare('UPDATE quotations SET sales_id=?, customer_id=?, need_text=?, price=?, remark=?, deadline=?, progress=? WHERE id=?');
      $st->execute([$input['sales_id'],$input['customer_id'],$input['need_text'],$input['price'],$input['remark'],$input['deadline'],$input['progress'],$input['id']]);
    } else {
      $st = $pdo->prepare('INSERT INTO quotations(sales_id,customer_id,need_text,price,remark,deadline,progress) VALUES(?,?,?,?,?,?,?)');
      $st->execute([$input['sales_id'],$input['customer_id'],$input['need_text'],$input['price'],$input['remark'],$input['deadline'],$input['progress']]);
    }
    out(['ok'=>true]);
  }

  if ($action === 'move-quotation' && $method === 'POST') {
    $st = $pdo->prepare('UPDATE quotations SET progress=? WHERE id=?');
    $st->execute([$input['progress'],$input['id']]);
    out(['ok'=>true]);
  }

  out(['error'=>'Unknown action'],404);
} catch (Throwable $e) {
  out(['error'=>$e->getMessage()],500);
}
