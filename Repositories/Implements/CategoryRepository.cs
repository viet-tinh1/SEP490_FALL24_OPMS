﻿using BusinessObject.Models;
using DataAccess.DAO;
using Repositories.Interface;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Repositories.Implements
{
    public class CategoryRepository : ICategoryRepository
    {
        public List<Category> GetCategory()
        {
            return CategoryDAO.GetCategories();
        }
    }
}
