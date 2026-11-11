import React, { useState, useEffect } from 'react';
import {
  Users, User, Sprout, ClipboardList, Package, Cpu,
  LogOut, Bell, CheckCircle, Clock, AlertTriangle,
  Plus, Droplets, Map, Activity
} from 'lucide-react';

// ==========================================
// 1. SEED DATA & CONSTANTS
// ==========================================
const SEED_USERS = [
  { id: 'U001', name: 'Nguyễn Văn Quản Lý', role: 'MANAGER', maxTasks: 10 },
  { id: 'U002', name: 'Trần Văn Nhân', role: 'WORKER', maxTasks: 3 },
  { id: 'U003', name: 'Lê Thị Viên', role: 'WORKER', maxTasks: 4 }
];

const SEED_PLOTS = [
  { id: 'P001', name: 'Lô đất A1 - Trồng Cà chua', expectedYield: 2000, area: 1500, type: 'DAT_TRONG' },
  { id: 'P002', name: 'Chuồng nuôi A2 - Lợn thịt', expectedYield: 1500, area: 800, type: 'KHU_CHAN_NUOI' }
];

const SEED_INVENTORY = [
  { id: 'INV001', name: 'Phân bón NPK', quantity: 100, unit: 'Bao', type: 'MATERIAL' },
  { id: 'INV002', name: 'Cà chua loại 1', quantity: 550, unit: 'kg', type: 'PRODUCT' }
];

const SEED_TASKS = [
  { id: 'T001', plotId: 'P001', workerId: 'U002', type: 'Bón phân', status: 'CHO_GIAO', date: new Date().toISOString() },
  { id: 'T002', plotId: 'P001', workerId: 'U002', type: 'Tưới nước', status: 'DANG_THUC_HIEN', date: new Date().toISOString() }
];

const SEED_NOTIFICATIONS = [
  { id: 'N001', title: 'Hệ thống', message: 'Hệ thống quản lý nông trại đã khởi động.', date: new Date().toISOString(), isRead: false }
];

// ==========================================
// 2. MAIN APP COMPONENT & STATE MANAGEMENT
// ==========================================
export default function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [users] = useState(SEED_USERS);
  const [plots, setPlots] = useState(SEED_PLOTS);
  const [inventory, setInventory] = useState(SEED_INVENTORY);
  const [tasks, setTasks] = useState(SEED_TASKS);
  const [harvests, setHarvests] = useState([]);
  const [notifications, setNotifications] = useState(SEED_NOTIFICATIONS);
  const [toasts, setToasts] = useState([]);

  // Hàm hiển thị thông báo góc màn hình (Toast)
  const addToast = (message, type = 'info') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3000);
  };

  const addNotification = (title, message) => {
    setNotifications(prev => [{
      id: `N${Date.now()}`, title, message, date: new Date().toISOString(), isRead: false
    }, ...prev]);
  };

  const handleLogin = (userId) => {
    const user = users.find(u => u.id === userId);
    setCurrentUser(user);
    addToast(`Đăng nhập thành công: ${user.name}`, 'success');
  };

  const handleLogout = () => {
    setCurrentUser(null);
  };

  if (!currentUser) {
    return <LoginScreen users={users} onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row font-sans text-gray-800 relative">
      {currentUser.role === 'MANAGER' ? (
        <ManagerDashboard
          user={currentUser} users={users} plots={plots} inventory={inventory}
          tasks={tasks} notifications={notifications}
          setPlots={setPlots} setInventory={setInventory} setTasks={setTasks}
          addNotification={addNotification} addToast={addToast} onLogout={handleLogout}
        />
      ) : (
        <WorkerDashboard
          user={currentUser} plots={plots} tasks={tasks}
          setTasks={setTasks} setInventory={setInventory} setHarvests={setHarvests}
          addNotification={addNotification} addToast={addToast} onLogout={handleLogout}
        />
      )}

      {/* Toast Container */}
      <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
        {toasts.map(t => (
          <div key={t.id} className={`px-4 py-3 rounded shadow-lg text-white font-medium flex items-center gap-2 animate-bounce-short
            ${t.type === 'error' ? 'bg-red-500' : t.type === 'success' ? 'bg-green-500' : t.type === 'warning' ? 'bg-yellow-500 text-yellow-900' : 'bg-blue-500'}`}>
            {t.type === 'warning' ? <AlertTriangle size={18} /> : <CheckCircle size={18} />}
            {t.message}
          </div>
        ))}
      </div>
    </div>
  );
}

// ==========================================
// 3. LOGIN SCREEN
// ==========================================
function LoginScreen({ users, onLogin }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-green-50 px-4">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md border-t-4 border-green-600">
        <div className="flex flex-col items-center mb-8">
          <div className="bg-green-100 p-4 rounded-full mb-3 text-green-600">
            <Sprout size={48} strokeWidth={1.5} />
          </div>
          <h1 className="text-2xl font-bold text-gray-800">Farm Management System</h1>
          <p className="text-gray-500 text-sm mt-1">Đăng nhập để vào hệ thống</p>
        </div>
        <div className="space-y-3">
          {users.map(user => (
            <button
              key={user.id}
              onClick={() => onLogin(user.id)}
              className={`w-full flex items-center justify-between p-4 rounded-xl border transition-all hover:shadow-md
                ${user.role === 'MANAGER' ? 'border-blue-200 hover:border-blue-500 bg-blue-50' : 'border-green-200 hover:border-green-500 bg-green-50'}`}
            >
              <div className="flex items-center gap-3">
                {user.role === 'MANAGER' ? <Users className="text-blue-600" /> : <User className="text-green-600" />}
                <div className="text-left">
                  <p className="font-semibold text-gray-800">{user.name}</p>
                  <p className="text-xs text-gray-500">{user.role === 'MANAGER' ? 'Quản lý nông trại' : 'Nhân viên nông trại'}</p>
                </div>
              </div>
              <span className="text-sm font-medium opacity-50">{user.id}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

// ==========================================
// 4. MANAGER DASHBOARD (ROLE: MANAGER)
// ==========================================
function ManagerDashboard({ user, users, plots, inventory, tasks, notifications, setPlots, setInventory, setTasks, addNotification, addToast, onLogout }) {
  const [activeTab, setActiveTab] = useState('overview');

  const navItems = [
    { id: 'overview', icon: Activity, label: 'Tổng quan' },
    { id: 'plots', icon: Map, label: 'Lô đất' },
    { id: 'tasks', icon: ClipboardList, label: 'Phân công' },
    { id: 'inventory', icon: Package, label: 'Kho vật tư' },
    { id: 'iot', icon: Cpu, label: 'IoT & Tưới' },
  ];

  return (
    <>
      {/* Sidebar */}
      <div className="w-full md:w-64 bg-green-800 text-white flex flex-col md:min-h-screen">
        <div className="p-5 flex items-center gap-3 border-b border-green-700">
          <Sprout size={32} />
          <h2 className="text-xl font-bold hidden md:block">Farm Manager</h2>
        </div>
        <nav className="flex-1 p-3 flex md:flex-col overflow-x-auto gap-1">
          {navItems.map(item => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg whitespace-nowrap transition-colors
                ${activeTab === item.id ? 'bg-green-700 font-semibold' : 'hover:bg-green-700/50'}`}
            >
              <item.icon size={20} />
              <span>{item.label}</span>
            </button>
          ))}
        </nav>
        <div className="p-4 border-t border-green-700 mt-auto hidden md:block">
          <p className="text-sm mb-2 opacity-80">Xin chào, {user.name}</p>
          <button onClick={onLogout} className="flex items-center gap-2 text-red-300 hover:text-red-100 transition-colors">
            <LogOut size={18} /> Đăng xuất
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-4 md:p-8 overflow-y-auto h-screen bg-gray-50">
        <div className="flex justify-between items-center md:hidden mb-4">
          <h2 className="text-xl font-bold text-gray-800">Quản lý Nông trại</h2>
          <button onClick={onLogout} className="p-2 text-red-500 rounded bg-red-50"><LogOut size={20} /></button>
        </div>

        {activeTab === 'overview' && (
          <ManagerOverview plots={plots} inventory={inventory} notifications={notifications} />
        )}
        {activeTab === 'plots' && (
          <PlotManager plots={plots} setPlots={setPlots} addToast={addToast} />
        )}
        {activeTab === 'tasks' && (
          <TaskManager users={users} plots={plots} tasks={tasks} setTasks={setTasks} addToast={addToast} />
        )}
        {activeTab === 'inventory' && (
          <InventoryManager inventory={inventory} />
        )}
        {activeTab === 'iot' && (
          <IoTSimulator addToast={addToast} addNotification={addNotification} />
        )}
      </div>
    </>
  );
}

// 4.1 Manager Overview
function ManagerOverview({ plots, inventory, notifications }) {
  const unreadNotifs = notifications.filter(n => !n.isRead);

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Tổng quan Nông trại</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4 border-l-4 border-l-blue-500">
          <div className="p-3 bg-blue-50 text-blue-600 rounded-full"><Map size={24} /></div>
          <div>
            <p className="text-sm text-gray-500 font-medium">Tổng Lô đất</p>
            <p className="text-2xl font-bold">{plots.length}</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4 border-l-4 border-l-green-500">
          <div className="p-3 bg-green-50 text-green-600 rounded-full"><Package size={24} /></div>
          <div>
            <p className="text-sm text-gray-500 font-medium">Vật tư / Nông sản</p>
            <p className="text-2xl font-bold">{inventory.length} loại</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4 border-l-4 border-l-red-500">
          <div className="p-3 bg-red-50 text-red-600 rounded-full"><Bell size={24} /></div>
          <div>
            <p className="text-sm text-gray-500 font-medium">Cảnh báo mới</p>
            <p className="text-2xl font-bold text-red-600">{unreadNotifs.length}</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
          <h3 className="font-bold flex items-center gap-2 text-gray-700">
            <Bell size={18} className="text-yellow-500" /> Thông báo & Cảnh báo
          </h3>
        </div>
        <div className="divide-y divide-gray-100 max-h-96 overflow-y-auto">
          {notifications.length === 0 ? (
            <p className="p-6 text-center text-gray-400">Không có thông báo nào</p>
          ) : (
            notifications.map(n => (
              <div key={n.id} className={`p-4 flex gap-4 ${n.isRead ? 'bg-white opacity-60' : 'bg-red-50/30'}`}>
                <div className="mt-1">
                  {n.title.includes('Cảnh báo') || n.title.includes('khô') ?
                    <AlertTriangle size={20} className="text-red-500" /> :
                    <Bell size={20} className="text-blue-400" />
                  }
                </div>
                <div>
                  <h4 className={`text-sm font-semibold ${!n.isRead ? 'text-gray-900' : 'text-gray-600'}`}>{n.title}</h4>
                  <p className="text-sm text-gray-600 mt-1">{n.message}</p>
                  <p className="text-xs text-gray-400 mt-2">{new Date(n.date).toLocaleString('vi-VN')}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

// 4.2 Plot Manager
function PlotManager({ plots, setPlots, addToast }) {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ name: '', area: '', expectedYield: '', type: 'DAT_TRONG' });

  const handleAddPlot = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.area || !formData.expectedYield) {
      addToast('Vui lòng điền đủ thông tin', 'error');
      return;
    }
    const newPlot = {
      id: `P00${plots.length + 1}`,
      name: formData.name,
      area: parseFloat(formData.area),
      expectedYield: parseFloat(formData.expectedYield),
      type: formData.type
    };
    setPlots([...plots, newPlot]);
    setShowForm(false);
    setFormData({ name: '', area: '', expectedYield: '', type: 'DAT_TRONG' });
    addToast('Đã thêm lô đất mới', 'success');
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Quản lý Lô đất & Khu vực</h2>
        <button onClick={() => setShowForm(!showForm)} className="bg-green-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-green-700 transition">
          <Plus size={18} /> Thêm Mới
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleAddPlot} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-6 flex flex-col gap-4 animate-in fade-in slide-in-from-top-4">
          <h3 className="font-bold border-b pb-2">Thêm Lô đất / Khu vực mới</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input placeholder="Tên lô đất (VD: Lô B1 - Ngô)" className="p-2 border rounded" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} />
            <select className="p-2 border rounded" value={formData.type} onChange={e => setFormData({ ...formData, type: e.target.value })}>
              <option value="DAT_TRONG">Đất trồng trọt</option>
              <option value="KHU_CHAN_NUOI">Khu chăn nuôi</option>
            </select>
            <input type="number" placeholder="Diện tích (m2)" className="p-2 border rounded" value={formData.area} onChange={e => setFormData({ ...formData, area: e.target.value })} />
            <input type="number" placeholder="Sản lượng dự kiến (kg)" className="p-2 border rounded" value={formData.expectedYield} onChange={e => setFormData({ ...formData, expectedYield: e.target.value })} />
          </div>
          <div className="flex justify-end gap-2 mt-2">
            <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2 text-gray-500 hover:bg-gray-100 rounded">Hủy</button>
            <button type="submit" className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">Lưu thông tin</button>
          </div>
        </form>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {plots.map(plot => (
          <div key={plot.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition">
            <div className="flex justify-between items-start mb-3">
              <h3 className="font-bold text-lg text-gray-800">{plot.name}</h3>
              <span className={`text-xs px-2 py-1 rounded-full font-medium ${plot.type === 'DAT_TRONG' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}`}>
                {plot.type === 'DAT_TRONG' ? 'Trồng trọt' : 'Chăn nuôi'}
              </span>
            </div>
            <div className="text-sm text-gray-600 space-y-2">
              <p>Mã Lô: <span className="font-medium">{plot.id}</span></p>
              <p>Diện tích: <span className="font-medium">{plot.area} m²</span></p>
              <p>Dự kiến thu: <span className="font-medium text-blue-600">{plot.expectedYield} kg</span></p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// 4.3 Task Manager (Phân công)
function TaskManager({ users, plots, tasks, setTasks, addToast }) {
  const workers = users.filter(u => u.role === 'WORKER');
  const [formData, setFormData] = useState({ plotId: '', workerId: '', type: 'Tưới nước' });

  // CORE LOGIC: Kiểm tra tải công việc nhân viên
  const handleAssignTask = (e) => {
    e.preventDefault();
    if (!formData.plotId || !formData.workerId) {
      addToast('Vui lòng chọn đủ lô đất và nhân viên', 'error');
      return;
    }

    const selectedWorker = workers.find(w => w.id === formData.workerId);

    // Đếm số công việc CHƯA hoàn thành của nhân viên này
    const activeTaskCount = tasks.filter(t => t.workerId === formData.workerId && t.status !== 'HOAN_THANH').length;

    if (activeTaskCount >= selectedWorker.maxTasks) {
      // Logic nghiệp vụ chặn phân công và báo lỗi
      addToast(`LỖI: Nhân viên ${selectedWorker.name} đã vượt tải (${activeTaskCount}/${selectedWorker.maxTasks} công việc). Vui lòng chọn nhân viên khác!`, 'error');
      return;
    }

    const newTask = {
      id: `T00${tasks.length + 1}`,
      plotId: formData.plotId,
      workerId: formData.workerId,
      type: formData.type,
      status: 'CHO_GIAO',
      date: new Date().toISOString()
    };

    setTasks([newTask, ...tasks]);
    addToast(`Đã giao việc "${formData.type}" cho ${selectedWorker.name}`, 'success');
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-1">
        <form onSubmit={handleAssignTask} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 sticky top-4">
          <h3 className="font-bold text-lg border-b pb-3 mb-4">Giao việc mới</h3>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Chọn Lô đất / Khu vực</label>
              <select required className="w-full p-2 border rounded" value={formData.plotId} onChange={e => setFormData({ ...formData, plotId: e.target.value })}>
                <option value="">-- Chọn lô đất --</option>
                {plots.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Chọn Nhân viên phụ trách</label>
              <select required className="w-full p-2 border rounded" value={formData.workerId} onChange={e => setFormData({ ...formData, workerId: e.target.value })}>
                <option value="">-- Chọn nhân viên --</option>
                {workers.map(w => (
                  <option key={w.id} value={w.id}>
                    {w.name} (Tải max: {w.maxTasks})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Loại công việc</label>
              <select className="w-full p-2 border rounded" value={formData.type} onChange={e => setFormData({ ...formData, type: e.target.value })}>
                <option value="Tưới nước">Tưới nước</option>
                <option value="Bón phân">Bón phân</option>
                <option value="Tiêm phòng">Tiêm phòng</option>
                <option value="Thu hoạch">Thu hoạch</option>
                <option value="Khác">Khác</option>
              </select>
            </div>

            <button type="submit" className="w-full bg-blue-600 text-white py-2.5 rounded-lg hover:bg-blue-700 font-medium mt-2">
              Xác nhận phân công
            </button>
          </div>
        </form>
      </div>

      <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-4 border-b bg-gray-50"><h3 className="font-bold text-lg">Danh sách công việc đã giao</h3></div>
        <div className="p-0 overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-gray-50 border-b text-gray-600">
              <tr>
                <th className="p-4 font-medium">Mã CV</th>
                <th className="p-4 font-medium">Công việc</th>
                <th className="p-4 font-medium">Lô / Khu vực</th>
                <th className="p-4 font-medium">Nhân viên</th>
                <th className="p-4 font-medium">Trạng thái</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {tasks.map(task => {
                const plot = plots.find(p => p.id === task.plotId);
                const worker = workers.find(w => w.id === task.workerId);
                return (
                  <tr key={task.id} className="hover:bg-gray-50">
                    <td className="p-4 text-gray-500">{task.id}</td>
                    <td className="p-4 font-medium">{task.type}</td>
                    <td className="p-4">{plot?.name || task.plotId}</td>
                    <td className="p-4">{worker?.name || task.workerId}</td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded text-xs font-medium
                        ${task.status === 'CHO_GIAO' ? 'bg-gray-100 text-gray-600' :
                          task.status === 'DANG_THUC_HIEN' ? 'bg-blue-100 text-blue-700' :
                            'bg-green-100 text-green-700'}`}>
                        {task.status === 'CHO_GIAO' ? 'Chờ nhận' : task.status === 'DANG_THUC_HIEN' ? 'Đang làm' : 'Hoàn thành'}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// 4.4 Inventory Manager
function InventoryManager({ inventory }) {
  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Quản lý Kho & Vật tư</h2>
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-50 border-b text-gray-600">
            <tr>
              <th className="p-4 font-medium">Mã SP</th>
              <th className="p-4 font-medium">Tên Vật tư / Nông sản</th>
              <th className="p-4 font-medium">Phân loại</th>
              <th className="p-4 font-medium text-right">Số lượng tồn kho</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {inventory.map(item => (
              <tr key={item.id} className="hover:bg-gray-50">
                <td className="p-4 text-gray-500 font-mono text-xs">{item.id}</td>
                <td className="p-4 font-medium text-gray-800">{item.name}</td>
                <td className="p-4">
                  <span className={`px-2 py-1 rounded text-xs font-medium ${item.type === 'MATERIAL' ? 'bg-purple-100 text-purple-700' : 'bg-green-100 text-green-700'}`}>
                    {item.type === 'MATERIAL' ? 'Vật tư (Phân/Thuốc)' : 'Nông sản thu hoạch'}
                  </span>
                </td>
                <td className="p-4 text-right font-bold text-lg text-green-600">
                  {item.quantity} <span className="text-sm text-gray-500 font-normal">{item.unit}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// 4.5 IoT Simulator
function IoTSimulator({ addToast, addNotification }) {
  const [sensorData, setSensorData] = useState({ temp: 28, moisture: 65, light: 12000 });
  const [isIrrigating, setIsIrrigating] = useState(false);

  // CORE LOGIC: Thu thập dữ liệu IoT và Tự động tưới
  const simulateData = () => {
    // Random độ ẩm đất từ 20% đến 60%
    const newMoisture = Math.floor(Math.random() * (60 - 20 + 1) + 20);
    const newTemp = (Math.random() * (35 - 25) + 25).toFixed(1);

    setSensorData(prev => ({ ...prev, moisture: newMoisture, temp: newTemp }));

    // Nếu độ ẩm < 40%, kích hoạt tưới và cảnh báo
    if (newMoisture < 40) {
      setIsIrrigating(true);
      addToast(`Cảnh báo: Đất khô (${newMoisture}%). Đã kích hoạt hệ thống tưới tự động!`, 'warning');
      addNotification(
        'Hệ thống tưới tự động kích hoạt',
        `Đã tự động bật máy tưới tại Lô P001 do độ ẩm đất giảm xuống mức nguy hiểm (${newMoisture}%).`
      );

      // Giả lập tắt tưới sau 5s
      setTimeout(() => {
        setIsIrrigating(false);
        setSensorData(prev => ({ ...prev, moisture: 65 })); // Đất ẩm lại
        addToast(`Tưới hoàn tất. Độ ẩm đất đã phục hồi (65%)`, 'success');
      }, 5000);
    } else {
      setIsIrrigating(false);
      addToast(`Dữ liệu môi trường ổn định. Độ ẩm: ${newMoisture}%`, 'success');
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-gray-800">Cảm biến IoT (P001)</h2>
        <button
          onClick={simulateData}
          disabled={isIrrigating}
          className="bg-purple-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-purple-700 transition disabled:opacity-50 flex items-center gap-2"
        >
          <Activity size={18} /> Simulate IoT Data
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col items-center justify-center text-center h-40">
          <Droplets size={32} className={sensorData.moisture < 40 ? 'text-red-500 animate-pulse' : 'text-blue-500'} />
          <h3 className="text-gray-500 font-medium mt-2">Độ ẩm đất</h3>
          <p className={`text-4xl font-bold mt-1 ${sensorData.moisture < 40 ? 'text-red-500' : 'text-gray-800'}`}>
            {sensorData.moisture}%
          </p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col items-center justify-center text-center h-40 relative overflow-hidden">
          {isIrrigating && (
            <div className="absolute inset-0 bg-blue-500/10 flex items-center justify-center">
              <span className="text-blue-600 font-bold animate-pulse">ĐANG TƯỚI NƯỚC...</span>
            </div>
          )}
          <Cpu size={32} className="text-gray-400" />
          <h3 className="text-gray-500 font-medium mt-2">Trạng thái Bơm</h3>
          <p className={`text-xl font-bold mt-1 ${isIrrigating ? 'text-blue-600' : 'text-green-600'}`}>
            {isIrrigating ? 'HOẠT ĐỘNG' : 'CHỜ (STANDBY)'}
          </p>
        </div>
      </div>
    </div>
  );
}

// ==========================================
// 5. WORKER DASHBOARD (ROLE: WORKER)
// ==========================================
function WorkerDashboard({ user, plots, tasks, setTasks, setInventory, setHarvests, addNotification, addToast, onLogout }) {
  const [activeTab, setActiveTab] = useState('tasks');

  return (
    <div className="flex-1 flex flex-col min-h-screen bg-gray-50 pb-16 md:pb-0">
      {/* Header Mobile */}
      <div className="bg-green-600 text-white p-4 flex justify-between items-center shadow-md z-10 relative">
        <div className="flex items-center gap-2">
          <User size={24} />
          <div>
            <h1 className="font-bold leading-tight">{user.name}</h1>
            <p className="text-xs text-green-200">Nhân viên nông trại</p>
          </div>
        </div>
        <button onClick={onLogout} className="p-2 bg-green-700 rounded-full hover:bg-green-800 transition"><LogOut size={16} /></button>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto p-4 max-w-3xl mx-auto w-full">
        {activeTab === 'tasks' ? (
          <WorkerTasks user={user} tasks={tasks} setTasks={setTasks} plots={plots} addToast={addToast} />
        ) : (
          <WorkerHarvest user={user} plots={plots} setHarvests={setHarvests} setInventory={setInventory} addNotification={addNotification} addToast={addToast} />
        )}
      </div>

      {/* Bottom Navigation (Mobile optimized) */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 flex justify-around p-2 md:relative md:max-w-3xl md:mx-auto md:w-full md:border md:rounded-t-2xl md:shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] z-20">
        <button
          onClick={() => setActiveTab('tasks')}
          className={`flex flex-col items-center p-2 px-6 rounded-xl transition ${activeTab === 'tasks' ? 'text-green-600 bg-green-50' : 'text-gray-400 hover:text-gray-600'}`}
        >
          <ClipboardList size={24} />
          <span className="text-xs font-medium mt-1">Việc của tôi</span>
        </button>
        <button
          onClick={() => setActiveTab('harvest')}
          className={`flex flex-col items-center p-2 px-6 rounded-xl transition ${activeTab === 'harvest' ? 'text-green-600 bg-green-50' : 'text-gray-400 hover:text-gray-600'}`}
        >
          <Sprout size={24} />
          <span className="text-xs font-medium mt-1">Ghi thu hoạch</span>
        </button>
      </div>
    </div>
  );
}

// 5.1 Worker Tasks
function WorkerTasks({ user, tasks, setTasks, plots, addToast }) {
  const myTasks = tasks.filter(t => t.workerId === user.id);

  const updateStatus = (taskId, newStatus) => {
    setTasks(tasks.map(t => t.id === taskId ? { ...t, status: newStatus } : t));
    addToast(`Đã cập nhật trạng thái công việc`, 'success');
  };

  return (
    <div className="space-y-4 animate-in fade-in">
      <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
        <ClipboardList className="text-green-600" /> Danh sách việc hôm nay
      </h2>

      {myTasks.length === 0 ? (
        <div className="text-center py-10 bg-white rounded-xl border border-gray-200 border-dashed">
          <p className="text-gray-500">Bạn chưa có công việc nào được giao.</p>
        </div>
      ) : (
        myTasks.map(task => {
          const plot = plots.find(p => p.id === task.plotId);
          return (
            <div key={task.id} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col gap-3 relative overflow-hidden">
              {/* Status indicator line */}
              <div className={`absolute left-0 top-0 bottom-0 w-1 
                ${task.status === 'CHO_GIAO' ? 'bg-gray-300' : task.status === 'DANG_THUC_HIEN' ? 'bg-blue-500' : 'bg-green-500'}`}></div>

              <div className="flex justify-between items-start pl-2">
                <div>
                  <h3 className="font-bold text-lg text-gray-800">{task.type}</h3>
                  <p className="text-sm text-gray-500 flex items-center gap-1 mt-1">
                    <Map size={14} /> {plot?.name}
                  </p>
                </div>
                <span className={`text-xs px-2 py-1 rounded font-medium border
                  ${task.status === 'CHO_GIAO' ? 'bg-gray-50 text-gray-600 border-gray-200' :
                    task.status === 'DANG_THUC_HIEN' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                      'bg-green-50 text-green-700 border-green-200'}`}>
                  {task.status === 'CHO_GIAO' ? 'Chờ nhận' : task.status === 'DANG_THUC_HIEN' ? 'Đang làm' : 'Hoàn thành'}
                </span>
              </div>

              <div className="pl-2 pt-2 border-t border-gray-50 flex gap-2">
                {task.status === 'CHO_GIAO' && (
                  <button onClick={() => updateStatus(task.id, 'DANG_THUC_HIEN')} className="flex-1 bg-blue-600 text-white py-2 rounded-lg text-sm font-medium hover:bg-blue-700">
                    Bắt đầu làm
                  </button>
                )}
                {task.status === 'DANG_THUC_HIEN' && (
                  <button onClick={() => updateStatus(task.id, 'HOAN_THANH')} className="flex-1 bg-green-600 text-white py-2 rounded-lg text-sm font-medium hover:bg-green-700 flex justify-center items-center gap-1">
                    <CheckCircle size={16} /> Đánh dấu Hoàn thành
                  </button>
                )}
                {task.status === 'HOAN_THANH' && (
                  <p className="text-sm text-green-600 italic font-medium w-full text-center py-1">Công việc đã kết thúc tốt đẹp!</p>
                )}
              </div>
            </div>
          );
        })
      )}
    </div>
  );
}

// 5.2 Worker Harvest (Ghi nhận thu hoạch & Core Logic)
function WorkerHarvest({ user, plots, setHarvests, setInventory, addNotification, addToast }) {
  const [formData, setFormData] = useState({ plotId: '', quantity: '', grade: 'Loại 1' });

  // CORE LOGIC: Ghi nhận thu hoạch -> Cập nhật kho -> Cảnh báo chênh lệch
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.plotId || !formData.quantity) {
      addToast('Vui lòng nhập đủ thông tin', 'error');
      return;
    }

    const qty = parseFloat(formData.quantity);
    if (qty <= 0) {
      addToast('Sản lượng phải > 0', 'error');
      return;
    }

    const selectedPlot = plots.find(p => p.id === formData.plotId);

    // 1. Lưu nhật ký
    const newHarvest = {
      id: `H${Date.now()}`,
      plotId: formData.plotId,
      workerId: user.id,
      quantity: qty,
      date: new Date().toISOString()
    };
    setHarvests(prev => [newHarvest, ...prev]);

    // 2. Logic cập nhật kho (Cộng dồn tự động)
    // Tách tên sản phẩm từ tên lô (VD: "Lô đất A1 - Trồng Cà chua" -> "Cà chua")
    // Giả định đơn giản cho demo: Lấy phần sau dấu '-' hoặc dùng tên lô
    const productNameMatch = selectedPlot.name.split('-');
    const baseProductName = productNameMatch.length > 1 ? productNameMatch[1].trim().replace('Trồng ', '') : selectedPlot.name;
    const inventoryName = `${baseProductName} ${formData.grade.toLowerCase()}`;

    setInventory(prev => {
      const existing = prev.find(i => i.name.toLowerCase() === inventoryName.toLowerCase());
      if (existing) {
        return prev.map(i => i.id === existing.id ? { ...i, quantity: i.quantity + qty } : i);
      } else {
        return [...prev, { id: `INV${Date.now()}`, name: inventoryName, quantity: qty, unit: 'kg', type: 'PRODUCT' }];
      }
    });

    // 3. Logic cảnh báo bất thường (Chênh lệch > 30% so với dự kiến)
    const expected = selectedPlot.expectedYield;
    const diffRatio = Math.abs(qty - expected) / expected;

    if (diffRatio > 0.3) {
      const direction = qty > expected ? 'cao hơn' : 'thấp hơn';
      const percent = (diffRatio * 100).toFixed(0);
      addNotification(
        'CẢNH BÁO BẤT THƯỜNG SẢN LƯỢNG',
        `Lô ${selectedPlot.name} vừa thu hoạch ${qty}kg. Mức này ${direction} ${percent}% so với dự kiến ban đầu (${expected}kg). Người ghi: ${user.name}`
      );
      // Vẫn toast thành công cho nhân viên biết đã lưu
      addToast(`Đã lưu ${qty}kg. Lưu ý: Sản lượng lệch >30% dự kiến!`, 'warning');
    } else {
      addToast(`Thu hoạch thành công: ${qty}kg đã được nhập kho.`, 'success');
    }

    setFormData({ plotId: '', quantity: '', grade: 'Loại 1' });
  };

  return (
    <div className="animate-in fade-in">
      <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
        <Sprout className="text-green-600" /> Ghi nhận thu hoạch (Nhập Kho)
      </h2>

      <form onSubmit={handleSubmit} className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex flex-col gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Chọn Lô / Chuồng thu hoạch</label>
          <select required className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl" value={formData.plotId} onChange={e => setFormData({ ...formData, plotId: e.target.value })}>
            <option value="">-- Bấm để chọn --</option>
            {plots.map(p => <option key={p.id} value={p.id}>{p.name} (Dự kiến: {p.expectedYield}kg)</option>)}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Sản lượng thực tế (kg/tấn)</label>
          <div className="relative">
            <input required type="number" step="0.1" placeholder="Nhập số lượng..."
              className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-lg font-bold text-green-700"
              value={formData.quantity} onChange={e => setFormData({ ...formData, quantity: e.target.value })}
            />
            <span className="absolute right-4 top-3 text-gray-400 font-medium">KG</span>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Phân loại chất lượng</label>
          <select className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl" value={formData.grade} onChange={e => setFormData({ ...formData, grade: e.target.value })}>
            <option value="Loại 1">Loại 1 (Đạt chuẩn xuất khẩu/siêu thị)</option>
            <option value="Loại 2">Loại 2 (Thị trường tự do)</option>
            <option value="Hàng dạt">Hàng dạt/Hư hỏng một phần</option>
          </select>
        </div>

        <button type="submit" className="w-full bg-green-600 text-white py-4 rounded-xl text-lg font-bold shadow-md hover:bg-green-700 active:scale-95 transition mt-2">
          Gửi Báo Cáo & Nhập Kho
        </button>

        <p className="text-xs text-gray-400 text-center mt-2">
          * Dữ liệu gửi lên sẽ tự động cộng dồn vào Hệ thống Kho vật tư của Nông trại.
        </p>
      </form>
    </div>
  );
}