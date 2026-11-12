import React, { useState } from 'react';
import {
  Users, User, Sprout, ClipboardList, Package, Cpu,
  Bell, CheckCircle, Clock, AlertTriangle, Plus, Droplets,
  Map, Activity, BarChart3, RefreshCw, ShieldAlert, ChevronRight, Sparkles, Layers
} from 'lucide-react';

// ==========================================
// SEED DATA (Chuẩn bị theo báo cáo)
// ==========================================
const SEED_USERS = [
  { user_id: 'U001', username: 'manager1', full_name: 'Nguyễn Văn Quản Lý', role: 'MANAGER', max_tasks_per_day: 10 },
  { user_id: 'U002', username: 'worker1', full_name: 'Trần Văn Nhân', role: 'WORKER', max_tasks_per_day: 3 },
  { user_id: 'U003', username: 'worker2', full_name: 'Lê Thị Viên', role: 'WORKER', max_tasks_per_day: 4 },
];

const SEED_PLOTS = [
  {
    plot_id: 'P001',
    plot_name: 'Lô đất A1 - Trồng Cà chua',
    area_m2: 1500,
    zone_type: 'DAT_TRONG',
    status: 'SINH_TRUONG',
    expected_yield_kg: 2000,
    crop: { crop_id: 'C001', crop_name: 'Cà chua Rita', category: 'CAY_TRONG', plant_date: '2026-09-01', growth_stage: 'Ra hoa kết trái' }
  },
  {
    plot_id: 'P002',
    plot_name: 'Chuồng nuôi A2 - Lợn thịt',
    area_m2: 800,
    zone_type: 'KHU_CHAN_NUOI',
    status: 'SAN_SANG_THU_HOACH',
    expected_yield_kg: 1500,
    crop: { crop_id: 'C002', crop_name: 'Lợn thịt hướng nạc', category: 'VAT_NUOI', plant_date: '2026-06-15', growth_stage: 'Xuất chuồng' }
  }
];

const SEED_TASKS = [
  {
    task_id: 'T001',
    plan_name: 'Kế hoạch bón phân tuần 10',
    plot_id: 'P001',
    worker_id: 'U002',
    task_type: 'BON_PHAN',
    due_date: '2026-11-12',
    status: 'DA_GIAO',
    note: 'Bón phân NPK đợt 2',
    material_id: 'M001',
    material_qty: 2
  },
  {
    task_id: 'T002',
    plan_name: 'Kế hoạch tưới nước tuần 10',
    plot_id: 'P001',
    worker_id: 'U003',
    task_type: 'TUOI_NUOC',
    due_date: '2026-11-12',
    status: 'HOAN_THANH',
    note: 'Tưới nước tự động 30 phút',
    material_id: null,
    material_qty: 0
  }
];

const SEED_MATERIALS = [
  { material_id: 'M001', material_name: 'Phân bón NPK 16-16-8', unit: 'Bao 50kg', stock_qty: 100 },
  { material_id: 'M002', material_name: 'Thức ăn hỗn hợp cho lợn', unit: 'Bao 25kg', stock_qty: 250 },
];

const SEED_INVENTORY = [
  { item_id: 'INV001', product_name: 'Cà chua Rita', quality_grade: 'Loại 1', quantity_kg: 550, last_updated: '2026-11-08 16:30' },
];

const SEED_HARVEST_LOGS = [
  {
    harvest_id: 'H001',
    plot_id: 'P001',
    recorded_by: 'U002',
    harvest_date: '2026-11-08 16:30',
    quantity_kg: 550,
    quality_grade: 'Loại 1',
    note: 'Thu hoạch đợt 1'
  }
];

const SEED_SENSOR_READINGS = [
  { reading_id: 'R001', sensor_id: 'S001', plot_id: 'P001', location: 'Góc Tây Bắc Lô A1', timestamp: '2026-11-12 08:00', temperature: 28.5, humidity: 75.0, soil_moisture: 42.0, light_level: 12000 },
  { reading_id: 'R002', sensor_id: 'S001', plot_id: 'P001', location: 'Góc Tây Bắc Lô A1', timestamp: '2026-11-12 12:00', temperature: 32.0, humidity: 65.0, soil_moisture: 35.5, light_level: 25000 },
];

const SEED_NOTIFICATIONS = [
  { notification_id: 'N001', user_id: 'U001', title: 'Ghi nhận thu hoạch đợt 1', content: 'Nhân viên Trần Văn Nhân vừa ghi nhận 550kg Cà chua Rita Loại 1.', is_read: false, created_at: '2026-11-08 16:30' }
];

const PLOT_STATUS_MAP = {
  TRONG: { label: 'Trống', color: 'bg-slate-100 text-slate-700 border-slate-200' },
  SINH_TRUONG: { label: 'Đang sinh trưởng', color: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  SAN_SANG_THU_HOACH: { label: 'Sẵn sàng thu hoạch', color: 'bg-amber-50 text-amber-700 border-amber-200' },
  DA_THU_HOACH: { label: 'Đã thu hoạch', color: 'bg-blue-50 text-blue-700 border-blue-200' },
  NGHI_DAT: { label: 'Nghỉ đất / Cải tạo', color: 'bg-purple-50 text-purple-700 border-purple-200' },
};

const TASK_STATUS_MAP = {
  CHO_GIAO: { label: 'Chờ giao', color: 'bg-slate-100 text-slate-600' },
  DA_GIAO: { label: 'Đã giao', color: 'bg-blue-50 text-blue-600 border border-blue-200' },
  DANG_THUC_HIEN: { label: 'Đang thực hiện', color: 'bg-amber-50 text-amber-600 border border-amber-200' },
  HOAN_THANH: { label: 'Hoàn thành', color: 'bg-emerald-50 text-emerald-600 border border-emerald-200' },
  DA_HUY: { label: 'Đã hủy', color: 'bg-rose-50 text-rose-600 border border-rose-200' },
};

const TASK_TYPE_LABELS = {
  TUOI_NUOC: 'Tưới nước',
  BON_PHAN: 'Bón phân',
  TIEM_PHONG: 'Tiêm phòng',
  KHAC: 'Công việc khác'
};

export default function App() {
  const [currentUser, setCurrentUser] = useState(SEED_USERS[0]);
  const [activeTab, setActiveTab] = useState('dashboard');

  const [plots, setPlots] = useState(SEED_PLOTS);
  const [tasks, setTasks] = useState(SEED_TASKS);
  const [materials, setMaterials] = useState(SEED_MATERIALS);
  const [inventory, setInventory] = useState(SEED_INVENTORY);
  const [harvestLogs, setHarvestLogs] = useState(SEED_HARVEST_LOGS);
  const [readings, setReadings] = useState(SEED_SENSOR_READINGS);
  const [notifications, setNotifications] = useState(SEED_NOTIFICATIONS);
  const [irrigationActive, setIrrigationActive] = useState(false);

  // Form Task
  const [newTask, setNewTask] = useState({
    plot_id: 'P001',
    worker_id: 'U002',
    task_type: 'BON_PHAN',
    due_date: '2026-11-12',
    note: '',
    material_id: 'M001',
    material_qty: 1
  });
  const [overloadWarning, setOverloadWarning] = useState('');

  // Form Harvest
  const [newHarvest, setNewHarvest] = useState({
    plot_id: 'P001',
    quantity_kg: '',
    quality_grade: 'Loại 1',
    note: ''
  });
  const [harvestAlert, setHarvestAlert] = useState(null);

  // IoT Simulation
  const [simSensor, setSimSensor] = useState({
    temperature: 34.5,
    humidity: 55,
    soil_moisture: 24.0,
    light_level: 28000
  });

  const pushNotification = (userId, title, content) => {
    const notif = {
      notification_id: 'N' + Date.now(),
      user_id: userId,
      title,
      content,
      is_read: false,
      created_at: new Date().toLocaleTimeString('vi-VN') + ' ' + new Date().toLocaleDateString('vi-VN')
    };
    setNotifications(prev => [notif, ...prev]);
  };

  const handleNextPlotStatus = (plotId) => {
    const order = ['TRONG', 'SINH_TRUONG', 'SAN_SANG_THU_HOACH', 'DA_THU_HOACH', 'NGHI_DAT'];
    setPlots(prev => prev.map(p => {
      if (p.plot_id !== plotId) return p;
      const nextIdx = (order.indexOf(p.status) + 1) % order.length;
      return { ...p, status: order[nextIdx] };
    }));
  };

  const handleAssignTask = (e) => {
    e.preventDefault();
    setOverloadWarning('');

    const worker = SEED_USERS.find(u => u.user_id === newTask.worker_id);
    const activeTasksCount = tasks.filter(
      t => t.worker_id === newTask.worker_id && t.due_date === newTask.due_date && t.status !== 'DA_HUY'
    ).length;

    if (activeTasksCount >= worker.max_tasks_per_day) {
      setOverloadWarning(
        `Cảnh báo vượt tải (Luồng 3a): Nhân viên ${worker.full_name} đã có ${activeTasksCount}/${worker.max_tasks_per_day} việc trong ngày ${newTask.due_date}.`
      );
      return;
    }

    if (newTask.material_id && newTask.material_qty > 0) {
      setMaterials(prev => prev.map(m =>
        m.material_id === newTask.material_id
          ? { ...m, stock_qty: Math.max(0, m.stock_qty - Number(newTask.material_qty)) }
          : m
      ));
    }

    const created = {
      task_id: 'T' + (tasks.length + 1).toString().padStart(3, '0'),
      plan_name: 'Kế hoạch chăm sóc định kỳ',
      ...newTask,
      material_qty: Number(newTask.material_qty),
      status: 'DA_GIAO'
    };

    setTasks([created, ...tasks]);
    pushNotification(worker.user_id, 'Phân công công việc mới', `Bạn được giao việc "${TASK_TYPE_LABELS[created.task_type]}" hạn ngày ${created.due_date}.`);
    setNewTask({ ...newTask, note: '' });
  };

  const handleUpdateTaskStatus = (taskId, nextStatus) => {
    setTasks(prev => prev.map(t => t.task_id === taskId ? { ...t, status: nextStatus } : t));
  };

  const handleSaveHarvest = (e) => {
    e.preventDefault();
    setHarvestAlert(null);
    const qty = Number(newHarvest.quantity_kg);
    if (qty <= 0) return;

    const plot = plots.find(p => p.plot_id === newHarvest.plot_id);
    const productName = plot.crop.crop_name;

    const log = {
      harvest_id: 'H' + (harvestLogs.length + 1).toString().padStart(3, '0'),
      plot_id: newHarvest.plot_id,
      recorded_by: currentUser.user_id,
      harvest_date: new Date().toLocaleTimeString('vi-VN') + ' ' + new Date().toLocaleDateString('vi-VN'),
      quantity_kg: qty,
      quality_grade: newHarvest.quality_grade,
      note: newHarvest.note || 'Thu hoạch định kỳ'
    };
    setHarvestLogs([log, ...harvestLogs]);

    setInventory(prev => {
      const existingIdx = prev.findIndex(
        item => item.product_name === productName && item.quality_grade === newHarvest.quality_grade
      );
      if (existingIdx > -1) {
        const updated = [...prev];
        updated[existingIdx] = {
          ...updated[existingIdx],
          quantity_kg: updated[existingIdx].quantity_kg + qty,
          last_updated: log.harvest_date
        };
        return updated;
      }
      return [
        { item_id: 'INV' + Date.now(), product_name: productName, quality_grade: newHarvest.quality_grade, quantity_kg: qty, last_updated: log.harvest_date },
        ...prev
      ];
    });

    const diffRatio = Math.abs(qty - plot.expected_yield_kg) / plot.expected_yield_kg;
    if (diffRatio > 0.3) {
      const percent = (diffRatio * 100).toFixed(1);
      const msg = `CẢNH BÁO BẤT THƯỜNG (UC05b): Sản lượng thực tế (${qty} kg) chênh lệch ${percent}% (>30%) so với dự kiến (${plot.expected_yield_kg} kg)!`;
      setHarvestAlert(msg);
      pushNotification('U001', 'Cảnh báo chênh lệch sản lượng >30%', msg);
    } else {
      pushNotification('U001', 'Ghi nhận thu hoạch mới', `${currentUser.full_name} đã nhập ${qty}kg ${productName} (${newHarvest.quality_grade}) vào kho.`);
    }

    setNewHarvest({ ...newHarvest, quantity_kg: '', note: '' });
  };

  const handleReceiveIoTData = (e) => {
    e.preventDefault();
    const newReading = {
      reading_id: 'R' + (readings.length + 1).toString().padStart(3, '0'),
      sensor_id: 'S001',
      plot_id: 'P001',
      location: 'Góc Tây Bắc Lô A1',
      timestamp: new Date().toLocaleTimeString('vi-VN') + ' ' + new Date().toLocaleDateString('vi-VN'),
      temperature: Number(simSensor.temperature),
      humidity: Number(simSensor.humidity),
      soil_moisture: Number(simSensor.soil_moisture),
      light_level: Number(simSensor.light_level)
    };
    setReadings([newReading, ...readings]);

    if (newReading.soil_moisture < 30) {
      setIrrigationActive(true);
      pushNotification('U001', 'Tự động kích hoạt tưới IoT (UC08)', `Độ ẩm đất Lô A1 giảm xuống ${newReading.soil_moisture}% (<30%). Hệ thống đã bật van tưới!`);
    } else {
      setIrrigationActive(false);
    }
  };

  const unreadCount = notifications.filter(n => !n.is_read).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-emerald-50/20 to-slate-100 flex flex-col md:flex-row font-sans text-slate-800 antialiased">
      {/* SIDEBAR HIỆN ĐẠI */}
      <aside className="w-full md:w-72 bg-slate-900 text-slate-100 flex flex-col justify-between p-5 shadow-2xl relative overflow-hidden">
        {/* Glow effect background */}
        <div className="absolute -top-24 -left-24 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div>
          {/* Logo Brand */}
          <div className="flex items-center gap-3.5 pb-6 border-b border-slate-800">
            <div className="p-2.5 bg-gradient-to-tr from-emerald-600 to-teal-400 rounded-xl shadow-lg shadow-emerald-900/30">
              <Sprout className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="font-bold text-lg tracking-tight text-white flex items-center gap-1.5">
                FarmOS <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              </h1>
              <p className="text-xs text-slate-400 font-medium">Smart Farm Management</p>
            </div>
          </div>

          {/* Account Selector Card */}
          <div className="mt-6 bg-slate-800/80 backdrop-blur-md p-3.5 rounded-xl border border-slate-700/60 shadow-inner">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] uppercase tracking-wider text-emerald-400 font-bold flex items-center gap-1">
                <ShieldAlert className="w-3 h-3" /> Tài khoản Demo (RBAC)
              </span>
            </div>
            <select
              value={currentUser.user_id}
              onChange={(e) => setCurrentUser(SEED_USERS.find(u => u.user_id === e.target.value))}
              className="w-full bg-slate-900 text-slate-200 text-xs font-medium rounded-lg px-3 py-2 border border-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition cursor-pointer"
            >
              {SEED_USERS.map(u => (
                <option key={u.user_id} value={u.user_id}>
                  {u.full_name} ({u.role})
                </option>
              ))}
            </select>
          </div>

          {/* Navigation Menu */}
          <nav className="mt-6 space-y-1.5">
            {[
              { id: 'dashboard', label: 'Tổng quan & Thống kê', icon: BarChart3 },
              { id: 'plots', label: 'Lô đất & Vòng đời', icon: Map },
              { id: 'tasks', label: 'Phân công & Nhật ký', icon: ClipboardList },
              { id: 'harvest', label: 'Thu hoạch & Kho', icon: Package },
              { id: 'iot', label: 'Cảm biến IoT & Tưới', icon: Cpu },
            ].map(item => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-xs font-semibold transition-all duration-200 ${
                    isActive
                      ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg shadow-emerald-600/20 translate-x-1'
                      : 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-200'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                    <span>{item.label}</span>
                  </div>
                  {isActive && <ChevronRight className="w-3.5 h-3.5 text-white/80" />}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Footer info */}
        <div className="pt-4 border-t border-slate-800 text-[11px] text-slate-500">
          <p className="font-semibold text-slate-400">Nhóm 9 - Đại học GTVT</p>
          <p className="mt-0.5">Phân tích Thiết kế Hướng đối tượng</p>
        </div>
      </aside>

      {/* MAIN CONTAINER */}
      <main className="flex-1 p-6 md:p-8 overflow-y-auto max-h-screen">
        {/* Top Header */}
        <header className="flex flex-wrap items-center justify-between gap-4 pb-6 mb-6 border-b border-slate-200/80">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider">Hệ thống đang hoạt động ổn định</span>
            </div>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight mt-0.5">
              {activeTab === 'dashboard' && 'Bảng điều khiển Tổng quan'}
              {activeTab === 'plots' && 'Quản lý Vùng trồng & Chăn nuôi'}
              {activeTab === 'tasks' && 'Lập kế hoạch & Phân công Công việc'}
              {activeTab === 'harvest' && 'Ghi nhận Nông sản & Quản lý Kho'}
              {activeTab === 'iot' && 'Trạm quan trắc IoT & Tự động hóa'}
            </h2>
          </div>

          {/* User Profile & Notification Badge */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-3 bg-white px-4 py-2 rounded-2xl border border-slate-200 shadow-sm">
              <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center font-bold text-emerald-700 text-xs">
                {currentUser.full_name.charAt(0)}
              </div>
              <div className="text-left">
                <p className="text-xs font-bold text-slate-800 leading-none">{currentUser.full_name}</p>
                <p className="text-[10px] text-slate-500 mt-1 font-medium">{currentUser.role === 'MANAGER' ? 'Quản lý nông trại' : 'Nhân viên nông trại'}</p>
              </div>
            </div>

            <button
              onClick={() => setNotifications(prev => prev.map(n => ({ ...n, is_read: true })))}
              className="relative p-2.5 bg-white border border-slate-200 rounded-2xl shadow-sm hover:bg-slate-50 transition"
              title="Thông báo hệ thống"
            >
              <Bell className="w-5 h-5 text-slate-600" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-rose-500 text-white text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center shadow-md animate-bounce">
                  {unreadCount}
                </span>
              )}
            </button>
          </div>
        </header>

        {/* TAB 1: DASHBOARD */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm hover:shadow-md transition">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Khu vực canh tác</span>
                  <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-2xl"></div>
                </div>
                <p className="text-3xl font-black text-slate-900 mt-3">{plots.length} <span className="text-sm font-normal text-slate-500">Khu vực</span></p>
                <div className="mt-3 flex items-center gap-1.5 text-xs text-emerald-600 font-semibold bg-emerald-50/80 px-2.5 py-1 rounded-lg w-fit">
                  <span>Tổng diện tích: {plots.reduce((a, b) => a + b.area_m2, 0)} m²</span>
                </div>
              </div>

              <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm hover:shadow-md transition">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Công việc cần làm</span>
                  <div className="p-2.5 bg-blue-50 text-blue-600 rounded-2xl"><ClipboardList className="w-5 h-5" /></div>
                </div>
                <p className="text-3xl font-black text-slate-900 mt-3">
                  {tasks.filter(t => t.status !== 'HOAN_THANH' && t.status !== 'DA_HUY').length} <span className="text-sm font-normal text-slate-500">việc</span>
                </p>
                <div className="mt-3 text-xs text-blue-600 font-semibold bg-blue-50/80 px-2.5 py-1 rounded-lg w-fit">
                  <span>Đã hoàn thành: {tasks.filter(t => t.status === 'HOAN_THANH').length}</span>
                </div>
              </div>

              <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm hover:shadow-md transition">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Kho thành phẩm</span>
                  <div className="p-2.5 bg-amber-50 text-amber-600 rounded-2xl"><Package className="w-5 h-5" /></div>
                </div>
                <p className="text-3xl font-black text-slate-900 mt-3">
                  {inventory.reduce((a, b) => a + b.quantity_kg, 0)} <span className="text-sm font-normal text-slate-500">kg</span>
                </p>
                <div className="mt-3 text-xs text-amber-600 font-semibold bg-amber-50/80 px-2.5 py-1 rounded-lg w-fit">
                  <span>{inventory.length} loại nông sản</span>
                </div>
              </div>

              <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm hover:shadow-md transition">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Trạng thái IoT</span>
                  <div className="p-2.5 bg-purple-50 text-purple-600 rounded-2xl"><Droplets className={`w-5 h-5 ${irrigationActive ? 'animate-bounce' : ''}`} /></div>
                </div>
                <p className="text-lg font-black text-slate-900 mt-3">
                  {irrigationActive ? 'ĐANG BẬT TƯỚI' : 'Giám sát ổn định'}
                </p>
                <div className="mt-3 text-xs text-purple-600 font-semibold bg-purple-50/80 px-2.5 py-1 rounded-lg w-fit">
                  <span>Độ ẩm đất: {readings[0]?.soil_moisture}%</span>
                </div>
              </div>
            </div>

            {/* Notification Stream */}
            <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm p-6">
              <h3 className="font-extrabold text-base text-slate-900 mb-4 flex items-center gap-2">
                <Bell className="w-4 h-4 text-amber-500" /> Dòng sự kiện & Cảnh báo thời gian thực
              </h3>
              <div className="space-y-3">
                {notifications.map(n => (
                  <div key={n.notification_id} className="p-4 rounded-2xl bg-slate-50/80 border border-slate-200/60 flex justify-between items-start gap-4 hover:bg-slate-100/50 transition">
                    <div>
                      <p className="font-bold text-sm text-slate-900">{n.title}</p>
                      <p className="text-xs text-slate-600 mt-1">{n.content}</p>
                    </div>
                    <span className="text-[11px] font-semibold text-slate-400 whitespace-nowrap bg-white px-2.5 py-1 rounded-lg border border-slate-200">{n.created_at}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: PLOTS */}
        {activeTab === 'plots' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {plots.map(plot => (
              <div key={plot.plot_id} className="bg-white rounded-3xl border border-slate-200/80 shadow-sm p-6 flex flex-col justify-between hover:shadow-md transition">
                <div>
                  <div className="flex justify-between items-start gap-3">
                    <div>
                      <span className="text-[11px] font-mono font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">{plot.plot_id}</span>
                      <h3 className="text-lg font-black text-slate-900 mt-2">{plot.plot_name}</h3>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold border ${PLOT_STATUS_MAP[plot.status].color}`}>
                      {PLOT_STATUS_MAP[plot.status].label}
                    </span>
                  </div>

                  <div className="mt-5 grid grid-cols-2 gap-3.5 text-xs bg-slate-50/80 p-4 rounded-2xl border border-slate-200/60">
                    <div>
                      <p className="text-slate-400 font-medium">Đối tượng canh tác</p>
                      <p className="font-bold text-slate-800 mt-0.5">{plot.crop.crop_name}</p>
                    </div>
                    <div>
                      <p className="text-slate-400 font-medium">Giai đoạn sinh trưởng</p>
                      <p className="font-bold text-slate-800 mt-0.5">{plot.crop.growth_stage}</p>
                    </div>
                    <div>
                      <p className="text-slate-400 font-medium">Diện tích khu vực</p>
                      <p className="font-bold text-slate-800 mt-0.5">{plot.area_m2} m²</p>
                    </div>
                    <div>
                      <p className="text-slate-400 font-medium">Sản lượng dự kiến</p>
                      <p className="font-bold text-emerald-700 mt-0.5">{plot.expected_yield_kg} kg</p>
                    </div>
                  </div>
                </div>

                {currentUser.role === 'MANAGER' && (
                  <div className="mt-6 pt-4 border-t border-slate-100 flex justify-between items-center">
                    <span className="text-xs text-slate-500 font-medium">Cập nhật vòng đời (Statechart):</span>
                    <button
                      onClick={() => handleNextPlotStatus(plot.plot_id)}
                      className="flex items-center gap-2 text-xs bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-4 py-2 rounded-xl shadow-md shadow-emerald-600/20 transition"
                    >
                      <RefreshCw className="w-3.5 h-3.5" /> Chuyển giai đoạn tiếp
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* TAB 3: TASKS */}
        {activeTab === 'tasks' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm p-6 h-fit">
              <h3 className="font-extrabold text-base text-slate-900 mb-4 flex items-center gap-2">
                <Plus className="w-4 h-4 text-emerald-600" /> Phân công công việc (UC04)
              </h3>

              {currentUser.role !== 'MANAGER' ? (
                <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl text-xs text-amber-800 font-medium">
                  Bạn đang đăng nhập quyền Nhân viên. Chỉ Quản lý mới có quyền lập kế hoạch và phân công công việc.
                </div>
              ) : (
                <form onSubmit={handleAssignTask} className="space-y-4 text-xs font-medium">
                  <div>
                    <label className="block text-slate-600 mb-1.5 font-bold">Lô đất / Chuồng trại</label>
                    <select
                      value={newTask.plot_id}
                      onChange={e => setNewTask({ ...newTask, plot_id: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 font-medium focus:ring-2 focus:ring-emerald-500 outline-none"
                    >
                      {plots.map(p => (
                        <option key={p.plot_id} value={p.plot_id}>{p.plot_name}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-slate-600 mb-1.5 font-bold">Nhân viên thực hiện</label>
                    <select
                      value={newTask.worker_id}
                      onChange={e => setNewTask({ ...newTask, worker_id: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 font-medium focus:ring-2 focus:ring-emerald-500 outline-none"
                    >
                      {SEED_USERS.filter(u => u.role === 'WORKER').map(w => (
                        <option key={w.user_id} value={w.user_id}>
                          {w.full_name} (Giới hạn: {w.max_tasks_per_day} việc/ngày)
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-slate-600 mb-1.5 font-bold">Loại công việc</label>
                      <select
                        value={newTask.task_type}
                        onChange={e => setNewTask({ ...newTask, task_type: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 font-medium outline-none"
                      >
                        <option value="TUOI_NUOC">Tưới nước</option>
                        <option value="BON_PHAN">Bón phân</option>
                        <option value="TIEM_PHONG">Tiêm phòng</option>
                        <option value="KHAC">Khác</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-slate-600 mb-1.5 font-bold">Ngày hạn</label>
                      <input
                        type="date"
                        value={newTask.due_date}
                        onChange={e => setNewTask({ ...newTask, due_date: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 font-medium outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    <div className="col-span-2">
                      <label className="block text-slate-600 mb-1.5 font-bold">Vật tư kho</label>
                      <select
                        value={newTask.material_id}
                        onChange={e => setNewTask({ ...newTask, material_id: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 font-medium outline-none"
                      >
                        <option value="">-- Không dùng --</option>
                        {materials.map(m => (
                          <option key={m.material_id} value={m.material_id}>{m.material_name}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-slate-600 mb-1.5 font-bold">Số lượng</label>
                      <input
                        type="number"
                        min="0"
                        value={newTask.material_qty}
                        onChange={e => setNewTask({ ...newTask, material_qty: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 font-medium outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-slate-600 mb-1.5 font-bold">Ghi chú nghiệp vụ</label>
                    <input
                      type="text"
                      placeholder="VD: Bón lót gốc buổi sáng..."
                      value={newTask.note}
                      onChange={e => setNewTask({ ...newTask, note: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 font-medium outline-none"
                    />
                  </div>

                  {overloadWarning && (
                    <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-2xl text-[11px] text-rose-700 flex items-start gap-2.5 font-semibold">
                      <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5 text-rose-600" />
                      <span>{overloadWarning}</span>
                    </div>
                  )}

                  <button
                    type="submit"
                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-xl shadow-lg shadow-emerald-600/20 transition text-xs"
                  >
                    Xác nhận phân công công việc
                  </button>
                </form>
              )}
            </div>

            <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-200/80 shadow-sm p-6">
              <h3 className="font-extrabold text-base text-slate-900 mb-4">
                Danh sách Công việc ({currentUser.role === 'WORKER' ? 'Việc của tôi' : 'Toàn hệ thống'})
              </h3>
              <div className="space-y-3.5">
                {tasks
                  .filter(t => currentUser.role === 'MANAGER' || t.worker_id === currentUser.user_id)
                  .map(task => {
                    const worker = SEED_USERS.find(u => u.user_id === task.worker_id);
                    const plot = plots.find(p => p.plot_id === task.plot_id);
                    return (
                      <div key={task.task_id} className="p-5 border border-slate-200/80 rounded-2xl flex flex-wrap justify-between items-center gap-4 bg-slate-50/50 hover:bg-white transition">
                        <div>
                          <div className="flex items-center gap-2.5">
                            <span className="font-bold text-slate-900 text-sm">{TASK_TYPE_LABELS[task.task_type]}</span>
                            <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-extrabold ${TASK_STATUS_MAP[task.status].color}`}>
                              {TASK_STATUS_MAP[task.status].label}
                            </span>
                          </div>
                          <p className="text-xs text-slate-600 mt-1 font-medium">
                            Khu vực: <strong className="text-slate-800">{plot?.plot_name}</strong> • Nhân sự: <strong className="text-emerald-700">{worker?.full_name}</strong>
                          </p>
                          <p className="text-[11px] text-slate-400 mt-1">
                            Hạn hoàn thành: <span className="font-semibold text-slate-600">{task.due_date}</span> {task.note && `• Ghi chú: ${task.note}`}
                          </p>
                        </div>

                        <div className="flex items-center gap-2">
                          {task.status === 'DA_GIAO' && (
                            <button
                              onClick={() => handleUpdateTaskStatus(task.task_id, 'DANG_THUC_HIEN')}
                              className="px-3.5 py-2 bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold rounded-xl shadow-sm transition"
                            >
                              Bắt đầu làm
                            </button>
                          )}
                          {task.status === 'DANG_THUC_HIEN' && (
                            <button
                              onClick={() => handleUpdateTaskStatus(task.task_id, 'HOAN_THANH')}
                              className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-sm transition"
                            >
                              Hoàn thành
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: HARVEST & INVENTORY */}
        {activeTab === 'harvest' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm p-6">
                <h3 className="font-extrabold text-base text-slate-900 mb-4">Ghi nhận Thu hoạch (UC05)</h3>
                <form onSubmit={handleSaveHarvest} className="space-y-4 text-xs font-medium">
                  <div>
                    <label className="block text-slate-600 mb-1.5 font-bold">Khu vực thu hoạch</label>
                    <select
                      value={newHarvest.plot_id}
                      onChange={e => setNewHarvest({ ...newHarvest, plot_id: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 outline-none font-medium"
                    >
                      {plots.map(p => (
                        <option key={p.plot_id} value={p.plot_id}>
                          {p.plot_name} (Dự kiến: {p.expected_yield_kg}kg)
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-slate-600 mb-1.5 font-bold">Sản lượng thực tế</label>
                      <input
                        type="number"
                        required
                        min="1"
                        placeholder="VD: 600 kg"
                        value={newHarvest.quantity_kg}
                        onChange={e => setNewHarvest({ ...newHarvest, quantity_kg: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 outline-none font-medium"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-600 mb-1.5 font-bold">Chất lượng</label>
                      <select
                        value={newHarvest.quality_grade}
                        onChange={e => setNewHarvest({ ...newHarvest, quality_grade: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 outline-none font-medium"
                      >
                        <option value="Loại 1">Loại 1 (Cao cấp)</option>
                        <option value="Loại 2">Loại 2 (Thường)</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-slate-600 mb-1.5 font-bold">Ghi chú đợt thu</label>
                    <input
                      type="text"
                      placeholder="VD: Thu hoạch đợt 2 buổi sáng..."
                      value={newHarvest.note}
                      onChange={e => setNewHarvest({ ...newHarvest, note: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 outline-none font-medium"
                    />
                  </div>

                  {harvestAlert && (
                    <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-2xl text-[11px] text-rose-700 flex items-start gap-2.5 font-semibold">
                      <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5 text-rose-600" />
                      <span>{harvestAlert}</span>
                    </div>
                  )}

                  <button
                    type="submit"
                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-xl shadow-lg shadow-emerald-600/20 transition text-xs"
                  >
                    Lưu thông tin & Cập nhật kho
                  </button>
                </form>
              </div>

              <div className="lg:col-span-2 space-y-6">
                <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm p-6">
                  <h3 className="font-extrabold text-base text-slate-900 mb-4">Kho Nông sản Thành phẩm (Inventory)</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full text-xs text-left">
                      <thead className="bg-slate-50 text-slate-400 font-bold uppercase tracking-wider">
                        <tr>
                          <th className="py-3 px-4">Tên nông sản</th>
                          <th className="py-3 px-4">Chất lượng</th>
                          <th className="py-3 px-4">Tồn kho hiện tại</th>
                          <th className="py-3 px-4">Cập nhật</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 font-medium">
                        {inventory.map(item => (
                          <tr key={item.item_id} className="hover:bg-slate-50/50">
                            <td className="py-3.5 px-4 font-bold text-slate-900">{item.product_name}</td>
                            <td className="py-3.5 px-4">
                              <span className="px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 font-bold text-[11px] border border-emerald-200">
                                {item.quality_grade}
                              </span>
                            </td>
                            <td className="py-3.5 px-4 font-black text-emerald-600 text-sm">{item.quantity_kg} kg</td>
                            <td className="py-3.5 px-4 text-slate-400 text-[11px]">{item.last_updated}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm p-6">
                  <h3 className="font-extrabold text-base text-slate-900 mb-4">Kho Vật tư Nông nghiệp (Materials)</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full text-xs text-left">
                      <thead className="bg-slate-50 text-slate-400 font-bold uppercase tracking-wider">
                        <tr>
                          <th className="py-3 px-4">Mã VT</th>
                          <th className="py-3 px-4">Tên vật tư</th>
                          <th className="py-3 px-4">Đơn vị</th>
                          <th className="py-3 px-4">Tồn kho</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 font-medium">
                        {materials.map(m => (
                          <tr key={m.material_id} className="hover:bg-slate-50/50">
                            <td className="py-3.5 px-4 font-mono font-bold text-slate-500">{m.material_id}</td>
                            <td className="py-3.5 px-4 font-bold text-slate-900">{m.material_name}</td>
                            <td className="py-3.5 px-4 text-slate-600">{m.unit}</td>
                            <td className="py-3.5 px-4 font-black text-blue-600 text-sm">{m.stock_qty}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: IOT SENSORS */}
        {activeTab === 'iot' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm p-6 h-fit">
              <h3 className="font-extrabold text-base text-slate-900 mb-1 flex items-center gap-2">
                <Activity className="w-4 h-4 text-blue-600" /> Giả lập Cảm biến IoT (S001)
              </h3>
              <p className="text-[11px] text-slate-500 mb-4 font-medium">
                Ngưỡng kích hoạt tưới tự động: <strong className="text-slate-800">Độ ẩm đất &lt; 30%</strong>
              </p>

              <form onSubmit={handleReceiveIoTData} className="space-y-3.5 text-xs font-medium">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-600 mb-1 font-bold">Nhiệt độ (°C)</label>
                    <input
                      type="number"
                      step="0.1"
                      value={simSensor.temperature}
                      onChange={e => setSimSensor({ ...simSensor, temperature: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-600 mb-1 font-bold">Độ ẩm KK (%)</label>
                    <input
                      type="number"
                      step="0.1"
                      value={simSensor.humidity}
                      onChange={e => setSimSensor({ ...simSensor, humidity: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-600 mb-1 font-bold">Độ ẩm đất (%)</label>
                    <input
                      type="number"
                      step="0.1"
                      value={simSensor.soil_moisture}
                      onChange={e => setSimSensor({ ...simSensor, soil_moisture: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 outline-none font-bold text-blue-600"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-600 mb-1 font-bold">Ánh sáng (Lux)</label>
                    <input
                      type="number"
                      value={simSensor.light_level}
                      onChange={e => setSimSensor({ ...simSensor, light_level: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 outline-none"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl shadow-lg shadow-blue-600/20 transition text-xs"
                >
                  Gửi dữ liệu Sensor mô phỏng
                </button>
              </form>

              {/* Trạng thái van tưới */}
              <div className={`mt-5 p-5 rounded-2xl border transition-all ${irrigationActive ? 'bg-blue-50/80 border-blue-300 text-blue-900 shadow-sm' : 'bg-slate-50 border-slate-200/80 text-slate-600'}`}>
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs flex items-center gap-2">
                    <Droplets className={`w-5 h-5 ${irrigationActive ? 'text-blue-600 animate-pulse' : 'text-slate-400'}`} />
                    Van tưới tự động Lô A1
                  </span>
                  <span className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider ${irrigationActive ? 'bg-blue-600 text-white shadow-md' : 'bg-slate-200 text-slate-700'}`}>
                    {irrigationActive ? 'ĐANG BẬT' : 'ĐÃ TẮT'}
                  </span>
                </div>
                {irrigationActive && (
                  <button
                    onClick={() => setIrrigationActive(false)}
                    className="mt-3.5 w-full py-2 bg-white border border-blue-300 rounded-xl text-xs font-bold text-blue-700 hover:bg-blue-50 transition shadow-sm"
                  >
                    Tắt thủ công
                  </button>
                )}
              </div>
            </div>

            <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-200/80 shadow-sm p-6">
              <h3 className="font-extrabold text-base text-slate-900 mb-4">Lịch sử Dữ liệu Cảm biến IoT (Sensor Readings)</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead className="bg-slate-50 text-slate-400 font-bold uppercase tracking-wider">
                    <tr>
                      <th className="py-3 px-4">Thời gian</th>
                      <th className="py-3 px-4">Vị trí</th>
                      <th className="py-3 px-4">Nhiệt độ</th>
                      <th className="py-3 px-4">Độ ẩm KK</th>
                      <th className="py-3 px-4">Độ ẩm đất</th>
                      <th className="py-3 px-4">Ánh sáng</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium">
                    {readings.map(r => (
                      <tr key={r.reading_id} className="hover:bg-slate-50/50">
                        <td className="py-3.5 px-4 text-[11px] text-slate-400 font-mono">{r.timestamp}</td>
                        <td className="py-3.5 px-4 font-bold text-slate-800">{r.location}</td>
                        <td className="py-3.5 px-4">{r.temperature}°C</td>
                        <td className="py-3.5 px-4">{r.humidity}%</td>
                        <td className={`py-3.5 px-4 font-black ${r.soil_moisture < 30 ? 'text-rose-600 bg-rose-50 px-2 py-0.5 rounded-lg w-fit' : 'text-emerald-600'}`}>
                          {r.soil_moisture}%
                        </td>
                        <td className="py-3.5 px-4">{r.light_level} Lux</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}