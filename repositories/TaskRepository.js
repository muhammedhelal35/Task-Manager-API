const Task = require('../models/Task');
const ApiError = require('../utils/apiError');

class TaskRepository {
  
  async create(taskData) {
    try {
      return await Task.create(taskData);
    } catch (error) {
      throw new ApiError(400, 'Failed to create task', error.message);
    }
  }

  
  async findById(id) {
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return null;
    }
    return await Task.findById(id);
  }

  
  async findAllByUser(userId, query = {}) {
    const { status, priority, search, sort, page = 1, limit = 10 } = query;
    
    const filter = { user: userId };
    if (status) filter.status = status;
    if (priority) filter.priority = priority;
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    let sortOption = { createdAt: -1 }; 
    if (sort) {
      const [field, order] = sort.split(':');
      if (['title', 'status', 'priority', 'dueDate', 'createdAt'].includes(field)) {
        sortOption = { [field]: order === 'desc' ? -1 : 1 };
      }
    }

    
    const validatedPage = Math.max(1, parseInt(page));
    const validatedLimit = Math.min(Math.max(1, parseInt(limit)), 100);

    const skip = (validatedPage - 1) * validatedLimit;

    
    const [tasks, total] = await Promise.all([
      Task.find(filter)
        .sort(sortOption)
        .skip(skip)
        .limit(validatedLimit)
        .lean(),
      Task.countDocuments(filter)
    ]);

    return {
      tasks,
      pagination: {
        total,
        page: validatedPage,
        pages: Math.ceil(total / validatedLimit),
        limit: validatedLimit
      }
    };
  }

  async update(id, updateData) {
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return null;
    }
    return await Task.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true, runValidators: true }
    );
  }

  
  async delete(id) {
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return null;
    }
    return await Task.findByIdAndDelete(id);
  }

  async findByIdAndUser(id, userId) {
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return null;
    }
    return await Task.findById({ _id: id}).lean();
  }
}

module.exports = TaskRepository;